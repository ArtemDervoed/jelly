import { drawImageProp, getNextItemIndex } from '../lib/common';
import { TimelineMax, Power1 } from 'gsap';

export default class Background {
  constructor(x, y, width, height) {
    this.width = width;
    this.height = height;
    this.images = [];
    this.imageIndexes = [0, 1];
    this.currentImg = null; // eslint-disable-line
    this.currentColor = null; // eslint-disable-line
    this.images = [];
    this.colors = [];
    // content types  - 'images', 'colors'
    this.mode = 'colors';
    this.colorIndexes = [0, 1];
    this.isImageFading = false;
    this.isFirstClick = true;
    this.ga = { globalAlpha: 1 };
    this.imageTimeline = new TimelineMax();
  }

  setSize = (width, height) => {
    this.width = width || this.width;
    this.height = height || this.height;
  }

  setPosition = (x, y) => {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  nextImg = () => {
    if (this.isImageFading) return;
    this.isImageFading = true;
    if (!this.isFirstClick) {
      this.imageIndexes[0] = this.imageIndexes[1]; // eslint-disable-line
      this.imageIndexes[1] = getNextItemIndex(this.imageIndexes[0], this.images);
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

  setImages = (images) => {
    this.images = [...images];
    this.currentImg = images[0]; // eslint-disable-line
  }

  setColors = (colors) => {
    this.colors = [...colors];
    this.currentColor = colors[0]; // eslint-disable-line
  }

  handleCompleteImageAnimation = () => {
    this.isImageFading = false;
    console.log('completed Image');
  }

  drawImage = (ctx) => {
    drawImageProp(
      ctx,
      this.images[this.imageIndexes[1]],
      0,
      0,
      this.width,
      this.height,
    );
    ctx.globalAlpha = this.ga.globalAlpha;
    drawImageProp(
      ctx,
      this.images[this.imageIndexes[0]],
      0,
      0,
      this.width,
      this.height,
    );
    ctx.globalAlpha = 1;
  }

  drawColors = (ctx) => {
    ctx.fillStyle = this.colors[this.colorIndexes[1]];
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalAlpha = this.ga.globalAlpha;
    ctx.fillStyle = this.colors[this.colorIndexes[0]];
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalAlpha = 1;
  }
}
