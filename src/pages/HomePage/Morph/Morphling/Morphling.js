import Mouse from './Mouse';
import Ball from './Ball';
import Background from './Background';
import { TweenMax } from 'gsap';
import SimplexNoise from 'simplex-noise';
import { getNextItemIndex } from './lib/common';

export default class Morphling {
  static instance;

  constructor() {
    if (Morphling.instance) {
      return Morphling.instance;
    }
    this.scale = 1;
    this.figures = [];
    this.radiuses = [];
    this.pointsCount = 100;
    this.emptyFigure = [];
    this.canvas = null;
    this.ctx = null;
    this.radius = 1;
    this.balls = [];
    this.shadow = [];
    this.isInto = false;
    this.offset = { x: 100, y: 100 };
    this.emptyRadiuses = [];
    this.Background = new Background(0, 0, window.innerWidth, window.innerHeight);
    this.simplex = new SimplexNoise();
    this.mouse = null;
    this.figureIndexes = [0, 1];
    this.isStaticAnimationWork = false;
    this.curentState = 0;
    this.imageMode = 'images';
    this.time = 0;
    this.showShadow = true;
    this.isCursorIntoPolyCalback = () => {};
    this.mode = {
      autoChangeImage: false,
      autoChangeFigure: false,
      isTransfomining: false,
      isImageChanging: false,
    };
    this.isCursorIntoPoly = false;
    Morphling.instance = this;
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.Background.setSize(this.canvas.width, this.canvas.height);
  }

  staticAnimation = (balls, time, isNegative) => {
    balls.forEach((item) => {
      const n = 12 * this.simplex.noise3D(item.oldX / 330, item.oldY / 330, time / 100);
      const align = isNegative ? -n : n;
      TweenMax.to(
        item,
        1,
        {
          x: item.oldX + align,
          y: item.oldY + align,
        },
      );
    });
  }

  startStaticAnimation = () => {
    this.isStaticAnimationWork = true;
  }

  stopStaticAnimation = () => {
    this.isStaticAnimationWork = false;
    this.changeFigureTo(this.figures[this.figureIndexes[0]], 1);
  }

  createEmptyFigure = () => {
    const center = this.getCenter(this.balls);
    return Array.from({ length: this.pointsCount }, () => [center.x, center.y]);
  }

  calcX = (center, radius, d, angle) =>
    center + (radius + d) * Math.cos(angle); // eslint-disable-line

  calcY = (center, radius, d, angle) =>
    center + (radius + d) * Math.sin(angle); // eslint-disable-line

  createFullScreenFigure = () => {
    const center = this.getCenter(this.balls);
    const fullScreenFigure = [];
    const side = Math.max(this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.pointsCount; i += 1) {
      fullScreenFigure.push([
        Math.round(
          this.calcX(
            center.x,
            1,
            side * 2,
            (i * 2 * (Math.PI / this.pointsCount)) - (Math.PI / 4),
          ),
          1,
        ),
        Math.round(
          this.calcY(
            center.y,
            1,
            side * 2,
            (i * 2 * (Math.PI / this.pointsCount)) - (Math.PI / 4),
          ),
          1,
        ),
      ]);
    }
    return fullScreenFigure;
  }

  init = (canvasSelector) => {
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
    this.pos.setOffset(this.offset.x, this.offset.y);
    this.mouse = new Ball(0, 0, 50, 'rgba(0,0,0,0)');
  }

  setScale = (scale) => {
    this.scale = scale;
  }

  setImages = (images) => {
    this.Background.setImages(images);
  }

  setColors = (colors) => {
    this.Background.setColors(colors);
  }

  setFigures = (figures) => {
    this.figures = figures;
    this.pushBalls();
    this.setNeighbours();
  }

  nextImg = () => {
    this.Background.nextImg();
  }

  nextImgTo = (id, duration = 1) => {
    this.Background.nextImgTo(id, duration);
  }

  nextImgAndFormTo = (formId, imgId) => {
    this.nextImgTo(imgId);
    this.nextFormTo(formId);
  }

  pushBalls = () => {
    for (let i = 0; i < this.pointsCount; i += 1) {
      this.balls.push(
        new Ball(
          this.figures[this.figureIndexes[0]][i][0],
          this.figures[this.figureIndexes[0]][i][1],
        ),
      );
      this.shadow.push(
        new Ball(
          this.figures[this.figureIndexes[0]][i][0],
          this.figures[this.figureIndexes[0]][i][1],
        ),
      );
    }
  }

  setNeighbours = () => {
    for (let i = 0; i < this.pointsCount; i += 1) {
      if (i === 0) {
        this.balls[i].setNeighbours([this.balls[this.pointsCount - 1], this.balls[i + 1]]);
      } else if (i === this.pointsCount - 1) {
        this.balls[i].setNeighbours([this.balls[i - 1], this.balls[0]]);
      } else {
        this.balls[i].setNeighbours([this.balls[i - 1], this.balls[i + 1]]);
      }
    }
  }

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  getIsCursorIntoPoly = (calback) => {
    this.isCursorIntoPolyCalback = calback;
  }

  getIsCursorIntoPolyState = () => this.isCursorIntoPoly

  setImageMode = (mode) => {
    this.imageMode = mode;
  }

  getCenter = (balls) => {
    let count = 0;
    let allx = 0;
    let ally = 0;
    const seg = balls;
    for (let i = 0; i < seg.length; i += 1) {
      allx += seg[i].oldX;
      ally += seg[i].oldY;
      count += 1;
    }
    return {
      x: allx / count,
      y: ally / count,
    };
  }

  connectDots = (dots, ctx, fillMode) => {
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
    if (fillMode === 'stroke') {
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (fillMode === 'fill') {
      ctx.fill();
    }
  }

  changeFigureTo = (nextFigurePath, duration) => {
    for (let i = 0; i < nextFigurePath.length; i += 1) {
      TweenMax.to(
        this.balls[i],
        duration,
        {
          x: nextFigurePath[i][0],
          y: nextFigurePath[i][1],
          originalX: nextFigurePath[i][0],
          originalY: nextFigurePath[i][1],
        },
      );
      TweenMax.to(
        this.shadow[i],
        duration,
        {
          x: nextFigurePath[i][0],
          y: nextFigurePath[i][1],
          originalX: nextFigurePath[i][0],
          originalY: nextFigurePath[i][1],
        },
      );
    }
  }

  moveCenter = (x, y) => {
    // const center = this.getCenter(this.balls);
    this.offset.x = x;
    this.offset.y = y;
    this.pos.setOffset(x, y);
  }

  handleCompleteTransform = () => {
    this.mode.isTransfomining = false;
  }

  nextForm = () => {
    this.figureIndexes[0] = getNextItemIndex(this.figureIndexes[0], this.figures);
    this.changeFigureTo(this.figures[this.figureIndexes[0]], 1);
  }

  nextFormTo = (id, duration) => {
    this.figureIndexes[0] = id;
    this.changeFigureTo(this.figures[this.figureIndexes[0]], duration || 1);
  }

  setFormFullscreen = (duration) => {
    this.changeFigureTo(this.createFullScreenFigure(), duration || 1);
  }

  setFormFullscreenNow = () => {
    this.changeFigureTo(this.createFullScreenFigure(), 0);
  }

  setFormEmptyState = (duration) => {
    this.changeFigureTo(
      this.createEmptyFigure(),
      duration || 2,
    );
  }

  restoreTheOriginalForm = (duration) => {
    this.changeFigureTo(this.figures[this.figureIndexes[0]], duration || 1);
  }

  calcNearsetPoint = (mouse) => {
    let nearPointIndex = 0;
    let minDist = Number.MAX_VALUE;
    this.balls.forEach((point, i) => {
      const dx = point.x - mouse.x;
      const dy = point.y - mouse.y;
      const dist = Math.sqrt((dx * dx) + (dy * dy));
      if (dist <= minDist) {
        minDist = dist;
        nearPointIndex = i;
      }
    });
    return {
      nearPointIndex,
      minDist,
      mx: mouse.x,
      my: mouse.y,
    };
  }

  checkPointDirection = (pos) => {
    const center = this.getCenter(this.balls);
    const dx = pos.x - center.x;
    const dy = center.y - pos.y;
    const dist = Math.sqrt((dx * dx) + (dy * dy));
    return {
      dist,
      dx,
      dy,
    };
  }

  processingPoints = (pos) => {
    // const nearPointDistIndex = this.calcNearsetPoint(pos);
    // this.checkCursorDirection(pos);
    this.balls.forEach((ball) => {
      ball.think(pos, 1);
    });
    this.shadow.forEach((ball) => {
      ball.think(pos, 1);
    });
  }

  drawBackground = () => {
    if (this.imageMode === 'color') {
      this.Background.drawColors(this.ctx);
    }
    if (this.imageMode === 'images') {
      this.Background.drawImage(this.ctx);
    }
  }

  handleIntersection = () => {
    const { nearPointIndex } = this.calcNearsetPoint(this.pos);
    const wavesLength = 50;
    let delayL = 0;
    let delayR = 0;
    const lastPointIndexR = nearPointIndex + wavesLength;
    for (let i = nearPointIndex; i <= lastPointIndexR; i += 1) {
      delayL += 1;
      let dx = 1;
      let dy = 1;

      dx = 10 * Math.sin((delayL + 1) * 2 * Math.PI);
      dy = 10 * Math.cos((delayL + 1) * 2 * Math.PI);
      const realI = i % this.balls.length;
      const pointDirection = this.checkPointDirection(this.balls[realI]);
      if (pointDirection.dx > 0) {
        dx *= 1;
      }

      if (pointDirection.dx < 0) {
        dx *= -1;
      }

      if (pointDirection.dy > 0) {
        dy *= 1;
      }

      if (pointDirection.dy < 0) {
        dy *= -1;
      }
      TweenMax.to(
        this.balls[realI],
        0.3,
        {
          x: this.balls[realI].x + dx,
          y: this.balls[realI].y + dy,
          originalX: this.balls[realI].x + dx,
          originalY: this.balls[realI].y + dy,
          yoyo: true,
          onComplete: () => {
            TweenMax.to(
              this.balls[realI],
              0.3,
              {
                x: this.figures[this.figureIndexes[0]][realI][0],
                y: this.figures[this.figureIndexes[0]][realI][1],
                originalX: this.figures[this.figureIndexes[0]][realI][0],
                originalY: this.figures[this.figureIndexes[0]][realI][1],
              },
            );
          },
        },
      ).delay(delayL / 20);
    }
    const lastPointIndexL = nearPointIndex - wavesLength;
    for (let j = nearPointIndex; j >= lastPointIndexL; j -= 1) {
      delayR += 1;
      let dx = 1;
      let dy = 1;

      dx = 10 * Math.sin((delayR + 1) * 2 * Math.PI);
      dy = 10 * Math.cos((delayR + 1) * 2 * Math.PI);
      const realI = j >= 0 ?
        j % this.balls.length :
        this.balls.length - Math.abs((j % this.balls.length));
      const pointDirection = this.checkPointDirection(this.balls[realI]);
      if (pointDirection.dx > 0) {
        dx *= 1;
      }

      if (pointDirection.dx < 0) {
        dx *= -1;
      }

      if (pointDirection.dy > 0) {
        dy *= 1;
      }

      if (pointDirection.dy < 0) {
        dy *= -1;
      }
      TweenMax.to(
        this.balls[realI],
        0.3,
        {
          x: this.balls[realI].x + dx,
          y: this.balls[realI].y + dy,
          originalX: this.balls[realI].x + dx,
          originalY: this.balls[realI].y + dy,
          yoyo: true,
          onComplete: () => {
            TweenMax.to(
              this.balls[realI],
              0.3,
              {
                x: this.figures[this.figureIndexes[0]][realI][0],
                y: this.figures[this.figureIndexes[0]][realI][1],
                originalX: this.figures[this.figureIndexes[0]][realI][0],
                originalY: this.figures[this.figureIndexes[0]][realI][1],
              },
            );
          },
        },
      ).delay(delayR / 20);
    }
  }

  render = () => {
    this.time += 0.5;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    if (this.isStaticAnimationWork) {
      this.staticAnimation(this.balls, this.time, false);
      if (this.showShadow) {
        this.staticAnimation(this.shadow, this.time + 10, true);
      }
    }
    // this.processingPoints(this.pos, this.scale);
    this.connectDots(this.balls, this.ctx, 'fill');
    this.isInto = this.pos.isInto(this.balls);
    if (this.isCursorIntoPoly !== this.isInto) {
      this.handleIntersection();
      this.isCursorIntoPoly = this.isInto;
      this.isCursorIntoPolyCalback(this.isInto);
    }
    this.ctx.restore();
    this.ctx.save();
    this.ctx.clip();
    this.drawBackground();
    this.ctx.restore();
    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    if (this.showShadow) {
      this.connectDots(this.shadow, this.ctx, 'stroke');
    }
    this.ctx.restore();
    window.requestAnimationFrame(this.render);
  }
}
