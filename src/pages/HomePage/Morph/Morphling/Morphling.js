import Mouse from './Mouse';
import Ball from './Ball';
import { TimelineMax } from 'gsap';
import { arrayToMatrix } from '_utils/common';

export default class Morphling {
  constructor(figures, initFigure) {
    this.figures = figures;
    this.currentPath = initFigure;
    this.canvas = null;
    this.ctx = null;
    this.pos = null;
    this.scaleFactor = 0.8;
    this.balls = [];
    this.isMousDown = false;
    this.figureTimeline = new TimelineMax();
    this.mouse = null;
    this.figureIndexes = [0, 0];
    this.state = ['original', 'open', 'close'];
    this.curentState = 0;
    this.mode = {
      autoChangeImage: false,
      autoChangeFigure: false,
      isTransfomining: false,
      isImageChanging: false,
    };
    console.log(this.figures);
    // let curentForm = arrayToMatrix(path1);    let matrix2 = arrayToMatrix(path2);
  }

  init = (canvasSelector) => {
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
    this.mouse = new Ball(0, 0, 30, 'rgba(0,0,0,0)');
    this.pushBalls(this.currentPath);
  }

  pushBalls = (path) => {
    arrayToMatrix(path).forEach((point) => {
      this.balls.push(new Ball(point[0], point[1]));
    });
  }

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
    // ctx.fill();
    const radialGradient = this.ctx.createRadialGradient(200, 200, 350, 200, 200, 400);
    radialGradient.addColorStop(0, 'white');
    radialGradient.addColorStop(1, 'black');
    this.ctx.fillStyle = radialGradient;
    this.ctx.lineWidth = 50;
    this.ctx.strokeStyle = radialGradient;
    this.ctx.stroke();
    // ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 100;
    ctx.stroke();
  }

  changeFigureTo = (nextFigurePath, duration, calback) => {
    this.mode.isTransfomining = true;
    console.log('path', this.currentPath);
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
    this.figureIndexes[0] = this.getNextFormIndex(this.figureIndexes[0], this.figures);
    this.figureTimeline.clear();
    this.changeFigureTo(this.figures[this.figureIndexes[0]], 2, this.handleCompleteTransform);
  }

  nextFormTo = (next) => {
    const activeState = this.figureTimeline.getActive(true, true, true)[0];
    this.figureIndexes[0] = next;
    if (activeState) {
      this.figureTimeline.clear();
      this.currentPath = activeState.target;
    }
    this.changeFigureTo(this.figures[this.figureIndexes[0]], 2, this.handleCompleteTransform);
  }

  comeToLifeCurentFigure = () => {
    if (this.mode.autoChangeFigure) {
      this.figureIndexes[1] = this.getNextFormIndex(
        this.figureIndexes[1],
        this.figures[this.figureIndexes[0]]);
      this.changeFigureTo(
        this.figures[this.figureIndexes[0]][this.figureIndexes[1]],
        5,
        this.comeToLifeCurentFigure);
    }
  }

  render = () => {
    window.requestAnimationFrame(this.render);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mouse.setPos(this.pos.x, this.pos.y);
    const matrix = arrayToMatrix(this.currentPath);
    this.balls.forEach((ball, i) => {
      ball.x = matrix[i][0];  // eslint-disable-line
      ball.y = matrix[i][1];  // eslint-disable-line
      ball.originalX = matrix[i][0];  // eslint-disable-line
      ball.originalY = matrix[i][1];  // eslint-disable-line
      ball.think(this.pos, true);
    });
    this.connectDots(this.balls, this.ctx);
  }
}
