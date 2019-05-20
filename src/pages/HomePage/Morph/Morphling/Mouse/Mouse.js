import { inPoly } from '../lib/common';

export default class Mouse {
  constructor(canvas) {
    this.x = 0;
    this.y = 0;
    this.canvas = canvas;
    // const rect = canvas.getBoundingClientRect();
    // this.canvas.onmousemove = (e) => {
    //   this.x = e.clientX - rect.left;
    //   this.y = e.clientY - rect.top;
    // };
    this.canvas.onmousemove = (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    };
  }
  isInto(balls) {
    const matrix = balls.map(p => [p.x, p.y]);
    return Boolean(inPoly(this.x, this.y, matrix));
  }
}
