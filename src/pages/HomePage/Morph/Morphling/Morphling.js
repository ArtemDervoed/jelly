import Mouse from './Mouse';
import Ball from './Ball';
import { TimelineMax } from 'gsap';
import { arrayToMatrix } from '_utils/common';
// import { bigRect } from '_data/figures';

export default class Morphling {
  constructor() {
    this.offset = [0, 0];
    this.figures = [];
    this.fullScreenFigure = [];
    this.emptyFigure = [];
    this.currentPath = [];
    this.currentImg = null; // eslint-disable-line
    this.images = [];
    this.ga = { globalAlpha: 1 };
    this.canvas = null;
    this.ctx = null;
    this.pos = null;
    this.scaleFactor = 0.8;
    this.balls = [];
    this.center = { x: 0, y: 0 };
    this.isMousDown = false;
    this.figureTimeline = new TimelineMax();
    this.imageTimeline = new TimelineMax();
    this.mouse = null;
    this.figureIndexes = [0, 1];
    this.imageIndexes = [0, 1];
    this.state = ['original', 'open', 'close'];
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
    // let curentForm = arrayToMatrix(path1);    let matrix2 = arrayToMatrix(path2);
  }

  handleResize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init = (canvasSelector, figures, images, initFigure, big) => {
    this.figures = figures;
    this.images = images;
    this.fullScreenFigure = [...big];
    this.currentImg = images[0]; // eslint-disable-line
    this.currentPath = [...initFigure];
    this.canvas = document.getElementById(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.pos = new Mouse(this.canvas);
    this.mouse = new Ball(0, 0, 30, 'red');
    this.pushBalls(this.currentPath);
    // this.buildNeighbours(this.balls);
    // this.ctx.translate(this.canvas.width / 2, 0);
  }

  setOffset = (x, y) => {
    this.offset[0] = x;
    this.offset[1] = y;
  }

  setEmptyFigure = (size) => {
    this.emptyFigure = [...Array(size).fill(0)];
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

  pushBalls = (path) => {
    const xcoords = [];
    const ycoords = [];

    const matrix = arrayToMatrix(path);

    matrix.forEach((point) => {
      const x = point[0] + this.offset[0];
      const y = point[1] + this.offset[1];
      xcoords.push(x);
      ycoords.push(y);
      this.balls.push(new Ball(x, y));
    });
    this.center = this.findCenterOfCircle(xcoords, ycoords);
  }

  findCenterOfCircle = (xcoords, ycoords) => {
    const minX = Math.min(...xcoords);
    const maxX = Math.max(...xcoords);
    console.log(minX, maxX);
    const minY = Math.min(...ycoords);
    const maxY = Math.max(...ycoords);
    return {
      xc: minX + ((maxX - minX) / 2),
      yc: minY + ((maxY - minY) / 2),
    };
  }

  // connectDots = (dots, ctx) => {
  //   ctx.beginPath();
  //   for (let i = 0, jlen = dots.length; i <= jlen; ++i) { // eslint-disable-line
  //     const p0 = dots[
  //       i + 0 >= jlen
  //         ? i + 0 - jlen // eslint-disable-line
  //         : i + 0
  //     ];
  //     const p1 = dots[
  //       i + 1 >= jlen
  //         ? i + 1 - jlen // eslint-disable-line
  //         : i + 1
  //     ];
  //     ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
  //   }
  //   ctx.closePath();
  //   // ctx.lineWidth = 10;
  //   ctx.fill();
  // }

/* eslint-disable */
  buildNeighbours = (dots) => {
    for (let i = 0, len = dots.length; i < len; i += 1) {
      const jp = dots[i];
      const pi = i === 0 ? len - 1 : i - 1;
      const ni = i === len - 1 ? 0 : i + 1;
      jp.setNeighbors(dots[pi], dots[ni]);
      // console.log(dots[pi], dots[ni],pi,ni);
      for (let j = 0; j < len; j += 1) {
        let ojp = dots[j];
        const curdist = Math.sqrt((ojp.x - jp.x) * (ojp.x - jp.x) + (ojp.y - jp.y) * (ojp.y - jp.y));
        if (
          ojp !== jp && ojp !== dots[pi] && ojp !== dots[ni] &&
            curdist <= 30
        ) {
          jp.addAcrossNeighbor(ojp);
        }
      }
    }
  }

  // eslint-enable

  connectDots = (balls) => {
    this.ctx.beginPath();
    this.ctx.moveTo(balls[0].x, balls[0].y);
    balls.forEach((ball) => {
      this.ctx.lineTo(ball.x, ball.y);
    });
    this.ctx.closePath();
    this.ctx.fill();
  }

  changeFigureTo = (nextFigurePath, duration, calback) => {
    this.mode.isTransfomining = true;
    console.log(this.figures, 'next');
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

  setFormFullscreen = () => {
    this.figureTimeline.clear();
    this.changeFigureTo(this.fullScreenFigure, 2, this.handleCompleteTransform);
  }

  setFormEmptyState = () => {
    console.log(this.emptyFigure);
    this.figureTimeline.clear();
    this.changeFigureTo(this.emptyFigure, 2, this.handleCompleteTransform);
  }

  processingPoints = (pos) => {
    const matrix = arrayToMatrix(this.currentPath);
    this.balls.forEach((ball, i) => {
      ball.x = matrix[i][0] + this.offset[0];  // eslint-disable-line
      ball.y = matrix[i][1] + this.offset[1];  // eslint-disable-line
      ball.originalX = matrix[i][0] + this.offset[0];  // eslint-disable-line
      ball.originalY = matrix[i][1] + this.offset[1];  // eslint-disable-line
      ball.think(pos, true);
    });
  }

  drawImages = () => {
    this.ctx.drawImage(
      this.images[this.imageIndexes[1]], 0, 0,
    );
    this.ctx.globalAlpha = this.ga.globalAlpha;
    this.ctx.drawImage(
      this.images[this.imageIndexes[0]], 0, 0,
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
