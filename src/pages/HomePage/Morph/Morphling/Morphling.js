import Mouse from './Mouse';
import Ball from './Ball';
import { TimelineMax } from 'gsap';
import { drawImageProp } from '_utils/common';

export default class Morphling {
  constructor(radiuses, fullScreenRadiuses) {
    this.figures = [];
    this.radiuses = [...radiuses];
    this.pointsCount = 32;
    this.fullScreenFigure = [...fullScreenRadiuses];
    this.emptyFigure = [];
    this.currentImg = null; // eslint-disable-line
    this.images = [];
    this.ga = { globalAlpha: 1 };
    this.canvas = null;
    this.ctx = null;
    this.radius = 200;
    this.scaleFactor = 0.8;
    this.balls = [];
    this.center = { x: 0, y: 0 };
    this.isMousDown = false;
    this.emptyRadiuses = [];
    this.figureTimeline = new TimelineMax();
    this.imageTimeline = new TimelineMax();
    this.centerTimeline = new TimelineMax();
    this.mouse = null;
    this.figureIndexes = [0, 1];
    this.currentPath = [...radiuses[this.figureIndexes[0]]];
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
  }


  moveCenter = (x, y, calback) => {
    this.centerTimeline.clear();
    this.centerTimeline.to(this.center, 2, { x, y })
      .eventCallback('onComplete', calback);
  }

  staticAnimation = () => {
    if (this.isStaticAnimationWork) {
      const correctedPath = this.currentPath.map((point) => { // eslint-disable-line
        return this.getRandomInt(point - 5, point + 5);
      });
      const negativeX = this.getRandomInt(0, 1);
      const negativeY = this.getRandomInt(0, 1);

      let x = this.getRandomInt(this.center.x, this.center.x + 10);
      let y = this.getRandomInt(this.center.y, this.center.y + 10);

      if (negativeX === 1) {
        x = this.getRandomInt(this.center.x, this.center.x - 10);
      }
      if (negativeY === 1) {
        y = this.getRandomInt(this.center.y, this.center.y - 10);
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
    this.centerTimeline.clear();
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
    this.pushBalls();
  }

  setEmptyFigure = (size) => {
    this.emptyFigure = [...Array(size).fill(0)];
  }

  setImages = (images) => {
    this.images = [...images];
    this.currentImg = images[0]; // eslint-disable-line
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

  changeImage = (calback) => {
    this.imageTimeline.fromTo(this.ga, 1, { globalAlpha: 1 }, { globalAlpha: 0 })
      .eventCallback('onComplete', calback);
  }

  pushBalls = () => {
    for (let i = 0; i < this.pointsCount; i += 1) {
      this.balls.push(
        new Ball(
          this.calcX(this.center.x, this.radius, 0, (i * 2 * Math.PI / this.pointsCount)), // eslint-disable-line
          this.calcY(this.center.y, this.radius, 0, (i * 2 * Math.PI / this.pointsCount)), // eslint-disable-line
        ),
      );
    }
  }

  setCenter = (x, y) => {
    this.center = { x, y };
    this.changeFigure();
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

  calcX = (center, radius, d, angle) =>
    Math.round(center + (radius + d) * Math.cos(angle), 1); // eslint-disable-line

  calcY = (center, radius, d, angle) =>
    Math.round(center + (radius + d) * Math.sin(angle), 1); // eslint-disable-line

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
    this.balls.forEach((ball) => {
      ball.think(pos, true);
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
    this.mouse.draw(this.ctx);
    window.requestAnimationFrame(this.render);
  }
}
