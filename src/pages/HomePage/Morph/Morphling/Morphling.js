import Mouse from './Mouse';
import Ball from './Ball';
import { toPoints } from 'svg-points';
import { TimelineMax, Power1 } from 'gsap';
import { drawImageProp } from '_utils/common';

export default class Morphling {
  constructor(fullScreenRadiuses) {
    this.figures = [];
    this.radiuses = [];
    this.pointsCount = 0;
    this.fullScreenFigure = [...fullScreenRadiuses];
    this.emptyFigure = [];
    this.currentImg = null; // eslint-disable-line
    this.images = [];
    this.ga = { globalAlpha: 1 };
    this.canvas = null;
    this.ctx = null;
    this.radius = 1;
    this.scaleFactor = 0.8;
    this.balls = [];
    this.center = { x: 500, y: 200 };
    this.isMousDown = false;
    this.emptyRadiuses = [];
    this.figureTimeline = new TimelineMax();
    this.imageTimeline = new TimelineMax();
    this.centerTimeline = new TimelineMax();
    this.mouse = null;
    this.RadiusCircle = null;
    this.centerBall = null;
    this.figureIndexes = [0, 1];
    this.currentPath = [];
    this.imageIndexes = [0, 1];
    this.isStaticAnimationWork = false;
    this.curentState = 0;
    this.isFirstClick = true;
    this.isImageFading = false;
    this.mode = {
      autoChangeImage: false,
      autoChangeFigure: false,
      isTransfomining: false,
      isImageChanging: false,
    };
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // this.ctx.scale((window.innerWidth / 1920) * 0.1, (window.innerHeight / 1080) * 0.1);
  }


  moveCenter = (x, y, calback) => {
    this.centerTimeline.clear();
    this.centerTimeline.to(this.center, 2, { x, y, ease: Power1.easeInOut })
      .eventCallback('onComplete', calback);
  }

  staticAnimation = () => {
    if (this.isStaticAnimationWork) {
      const correctedPath = this.currentPath.map((point) => { // eslint-disable-line
        return this.getRandomInt(point - 10, point + 10);
      });
      const negativeX = this.getRandomInt(0, 1);
      const negativeY = this.getRandomInt(0, 1);

      let x = this.getRandomInt(this.center.x, this.center.x + 15);
      let y = this.getRandomInt(this.center.y, this.center.y + 15);

      if (negativeX === 1) {
        x = this.getRandomInt(this.center.x, this.center.x - 15);
      }
      if (negativeY === 1) {
        y = this.getRandomInt(this.center.y, this.center.y - 15);
      }
      this.moveCenter(x, y, this.startStaticAnimation);
      this.changeFigureTo(correctedPath, 2, () => { console.log('aaa'); });
    } else {
      this.centerTimeline.clear();
    }
  }

  startStaticAnimation = () => {
    this.isStaticAnimationWork = true;
    this.staticAnimation();
  }

  stopStaticAnimation = () => {
    this.isStaticAnimationWork = false;
    this.centerTimeline.kill();
  }

  createEmptyFigure = () => {
    this.emptyRadiuses = Array.from({ length: this.pointsCount }, () => -this.radius);
  }

  init = (canvasSelector) => {
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
    this.mouse = new Ball(0, 0, 50, 'rgba(0,0,0,0)');
  }

  setEmptyFigure = (size) => {
    this.emptyFigure = [...Array(size).fill(0)];
  }

  setImages = (images) => {
    this.images = [...images];
    this.currentImg = images[0]; // eslint-disable-line
  }

  setFigures = (figures) => {
    this.figures = figures;
    this.radiuses = figures.map((fig) => {
      this.pth = fig.childNodes[0]; // eslint-disable-line
      this.points = toPoints({
        type: 'path',
        d: this.pth.getAttribute('d'),
      });
      return this.convertToPolarCoordinates(this.points).map(point => point.dist);
    });
    this.currentPath = [...this.radiuses[0]];
    this.pointsCount = this.currentPath.length - 1;
    this.pushBalls();
  }

  handleCompleteImageAnimation = () => {
    this.isImageFading = false;
    console.log('completed Image');
  }

  nextImg = () => {
    if (this.isImageFading) return;
    this.isImageFading = true;
    if (!this.isFirstClick) {
      this.imageIndexes[0] = this.imageIndexes[1]; // eslint-disable-line
      this.imageIndexes[1] = this.getNextFormIndex(this.imageIndexes[0], this.images);
    }
    this.isFirstClick = false;
    this.changeImage(this.handleCompleteImageAnimation);
  }

  nextImgTo = (id) => {
    if (this.isImageFading) return;
    this.isImageFading = true;
    if (!this.isFirstClick) {
      this.imageIndexes[0] = this.imageIndexes[1]; // eslint-disable-line
      this.imageIndexes[1] = id;
    }
    this.isFirstClick = false;
    this.changeImage(this.handleCompleteImageAnimation);
  }

  changeImage = (calback) => {
    this.imageTimeline.fromTo(
      this.ga,
      1,
      { globalAlpha: 1, ease: Power1.easeInOut },
      { globalAlpha: 0, ease: Power1.easeInOut },
    )
      .eventCallback('onComplete', calback);
  }

  nextImgAndFormTo = (formId, imgId) => {
    this.nextImgTo(imgId);
    this.nextFormTo(formId);
  }

  pushBalls = () => {
    for (let i = 0; i < this.pointsCount; i += 1) {
      this.balls.push(
        new Ball(
          Math.round(this.calcX(this.center.x, 1, 0, (i * 2 * Math.PI / this.pointsCount)), 1), // eslint-disable-line
          Math.round(this.calcY(this.center.y, 1, 0, (i * 2 * Math.PI / this.pointsCount)), 1), // eslint-disable-line
        ),
      );
    }
  }

  setCenter = (x, y) => {
    this.center = { x, y };
  }

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  changeFigure = () => {
    this.balls.forEach((point, i) => {
      const nextX = this.calcX(this.center.x, this.radius, this.currentPath[i], (i * 2 * Math.PI / this.pointsCount)); // eslint-disable-line
      const nextY = this.calcY(this.center.y, this.radius, this.currentPath[i], (i * 2 * Math.PI / this.pointsCount)); // eslint-disable-line
      point.setPos(nextX, nextY);
      point.setOldPos(nextX, nextY);
    });
  }

  convertToPolarCoordinates = (points) => {
    const center = this.findCenter(points);
    // this.centerBall.x = center.cx + this.center.x;
    // this.centerBall.y = center.cy + this.center.y;
    const polarCoordinates = points.map((point) => {
      const dx = center.cx - point.x;
      const dy = center.cy - point.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));
      const angle = Math.atan2(dy, dx);
      return { dist, angle, curve: point.curve };
    });

    return polarCoordinates;
  }

  findCenter = (points) => {
    let top = points[0].y;
    let left = points[0].x;
    let right = 0;
    let bottom = 0;
    points.forEach((point) => {
      if (point.y > bottom) {
        bottom = point.y;
      }
      if (point.x > right) {
        right = point.x;
      }
      if (point.y < top) {
        top = point.y;
      }
      if (point.x < left) {
        left = point.x;
      }
    });
    const center = {
      cx: top + ((bottom - top) / 2),
      cy: left + ((right - left) / 2),
    };
    return center;
  }

  calcX = (center, radius, d, angle) =>
    center + (radius + d) * Math.cos(angle); // eslint-disable-line

  calcY = (center, radius, d, angle) =>
    center + (radius + d) * Math.sin(angle); // eslint-disable-line

  connectDots = (dots, ctx) => {
    ctx.beginPath();
    for (let i = 0, jlen = dots.length; i <= jlen; ++i) { // eslint-disable-line
      const p0 = dots[
        i + 0 >= jlen
          ? i + 0 - jlen // eslint-disable-line
          : i + 0
      ];
      const p1 = dots[
        i + 1 >= jlen
          ? i + 1 - jlen // eslint-disable-line
          : i + 1
      ];
      ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    }
    ctx.closePath();
    ctx.fill();
  }

  // connectDots = (balls, ctx) => {
  //   ctx.beginPath();
  //   ctx.moveTo(balls[0].x, balls[0].y);
  //   balls.forEach((ball) => {
  //     ctx.lineTo(ball.x, ball.y);
  //   });
  //
  //   ctx.closePath();
  //   ctx.fill();
  // }

  changeFigureTo = (nextFigurePath, duration, calback) => {
    this.mode.isTransfomining = true;
    this.figureTimeline.to(this.currentPath, duration, nextFigurePath)
      .eventCallback('onComplete', calback);
  }

  handleCompleteTransform = () => {
    this.mode.isTransfomining = false;
  }

  getNextFormIndex = (curentIndex, collection) => {
    if (curentIndex === collection.length - 1) {
      return 0;
    }
    return curentIndex + 1;
  }

  nextForm = () => {
    this.figureIndexes[0] = this.getNextFormIndex(this.figureIndexes[0], this.radiuses);
    console.log(this.figureIndexes[0], this.radiuses);
    this.figureTimeline.clear();
    this.changeFigureTo(this.radiuses[this.figureIndexes[0]], 1, this.handleCompleteTransform);
  }

  nextFormTo = (id) => {
    this.figureIndexes[0] = id;
    this.figureTimeline.clear();
    this.changeFigureTo(this.radiuses[this.figureIndexes[0]], 1, this.handleCompleteTransform);
  }

  setFormFullscreen = () => {
    this.figureTimeline.clear();
    this.changeFigureTo(this.fullScreenFigure, 1, this.handleCompleteTransform);
  }

  setFormEmptyState = () => {
    this.figureTimeline.clear();
    this.createEmptyFigure();
    this.changeFigureTo(this.emptyRadiuses, 2, this.handleCompleteTransform);
  }

  restoreTheOriginalForm = () => {
    this.figureTimeline.clear();
    this.changeFigureTo(this.radiuses[this.figureIndexes[0]], 1, this.handleCompleteTransform);
  }

  processingPoints = (pos) => {
    this.changeFigure();
    this.balls.forEach((ball, i) => {
      ball.think(pos, i * 0);
    });
  }

  drawImages = () => {
    drawImageProp(
      this.ctx,
      this.images[this.imageIndexes[1]],
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.globalAlpha = this.ga.globalAlpha;
    drawImageProp(
      this.ctx,
      this.images[this.imageIndexes[0]],
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    this.ctx.globalAlpha = 1;
  }

  render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImages();
    this.ctx.globalCompositeOperation = 'destination-in';
    this.mouse.setPos(this.pos.x, this.pos.y);
    this.processingPoints(this.pos);
    this.connectDots(this.balls, this.ctx);
    this.ctx.globalCompositeOperation = 'source-over';
    window.requestAnimationFrame(this.render);
  }
}
