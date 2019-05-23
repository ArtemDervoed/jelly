import { inPoly } from '../lib/common';

export default class Mouse {
  constructor(canvas) {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.canvas = canvas;
    // const rect = canvas.getBoundingClientRect();
    // this.canvas.onmousemove = (e) => {
    //   this.x = e.clientX - rect.left;
    //   this.y = e.clientY - rect.top;
    // };
    this.canvas.onmousemove = (e) => {
      this.x = e.clientX - this.dx;
      this.y = e.clientY - this.dy;
    };
  }

  setOffset(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  isInto(balls) {
    const matrix = balls.map(p => [p.x, p.y]);
    return Boolean(inPoly(this.x, this.y, matrix));
  }

  isIntoArr(points) {
    const matrix = points.map(p => [p[0], p[1]]);
    return Boolean(inPoly(this.x, this.y, matrix));
  }
}
