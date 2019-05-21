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
    this.offset = { x: 0, y: 0 };
    this.emptyRadiuses = [];
    this.Background = new Background(0, 0, window.innerWidth, window.innerHeight);
    this.simplex = new SimplexNoise();
    this.mouse = null;
    this.figureIndexes = [0, 1];
    this.isStaticAnimationWork = false;
    this.curentState = 0;
    this.imageMode = 'images';
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


  moveCenter = (x, y) => {
    TweenMax.to(this.offset, 1, { x, y });
  }

  staticAnimation = () => {
    console.log('animated');
  }

  startStaticAnimation = () => {
    this.isStaticAnimationWork = true;
    this.staticAnimation();
  }

  stopStaticAnimation = () => {
    this.isStaticAnimationWork = false;
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
    console.log(fullScreenFigure);
    return fullScreenFigure;
  }

  init = (canvasSelector) => {
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
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
      allx += seg[i].x;
      ally += seg[i].y;
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
      ctx.stroke();
    }
    if (fillMode === 'fill') {
      ctx.fill();
    }
  }

  changeFigureTo = (nextFigurePath, duration) => {
    for (let i = 0; i < nextFigurePath.length; i += 1) {
      if (this.balls[i]) {
        TweenMax.to(
          this.balls[i],
          duration,
          {
            x: nextFigurePath[i][0] + this.offset.x,
            y: nextFigurePath[i][1] + this.offset.y,
            originalX: nextFigurePath[i][0] + this.offset.x,
            originalY: nextFigurePath[i][1] + this.offset.y,
          },
        );
      }
    }
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

  processingPoints = (pos, scale) => {
    this.balls.forEach((ball) => {
      ball.think(pos, scale);
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

  renderShadow = (balls) => {
    const shadow = [...balls];
    shadow.forEach((item, index) => {
      item.setPos(
        this.simplex.noise2D(item.x, index),
        this.simplex.noise2D(item.y, index),
      );
      item.setOldPos(
        this.simplex.noise2D(item.x, index),
        this.simplex.noise2D(item.y, index),
      );
      return item;
    });
    console.log(balls);
    this.connectDots(shadow, this.ctx, 'stroke');
  }

  render = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.ctx.globalCompositeOperation = 'destination-in';
    this.mouse.setPos(this.pos.x, this.pos.y);
    this.processingPoints(this.pos, this.scale);
    this.connectDots(this.balls, this.ctx, 'fill');
    const isInto = this.pos.isInto(this.balls);
    if (this.isCursorIntoPoly !== isInto) {
      this.isCursorIntoPoly = isInto;
      this.isCursorIntoPolyCalback(isInto);
    }
    this.ctx.globalCompositeOperation = 'source-over';
    // this.renderShadow(this.balls);
    window.requestAnimationFrame(this.render);
  }
}
