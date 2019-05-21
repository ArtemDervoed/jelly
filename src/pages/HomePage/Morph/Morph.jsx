import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Morph.scss';
import Morphling from './Morphling';
import { vector, figure } from '_data/figures';

import img1 from '_images/1.jpg';
import img2 from '_images/2.jpg';
import img3 from '_images/3.jpg';

class Morph extends React.Component {
  constructor() {
    super();
    this.morphling = null;
    this.Morphling = new Morphling();
  }

  componentDidMount() {
    const images = document.getElementsByClassName(styles.hidden);
    this.Morphling.init('canvas');
    this.Morphling.setFigures([this.normolizeFigure(vector), this.normolizeFigure(figure)]);
    this.Morphling.setImages(images);
    this.Morphling.setColors(['blue', 'red', 'green']);
    this.Morphling.render();
    this.canvas.addEventListener('click', this.handleMoveCenter);
  }

  shouldComponentUpdate = () => false;

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  normolizeFigure = (points) => {
    let min = points[0][1];
    let index = 0;
    for (let i = 0; i < points.length; i += 1) {
      if (min > points[i][1]) {
        min = points[i][1]; // eslint-disable-line
        index = i;
      }
    }
    const temp = [...points];
    return temp.splice(index).concat(temp);
  }

  handlePaused = () => {
    console.log('click');
  }

  handleContune = () => {
    this.Morphling.setCenter(window.innerWidth / 2, window.innerHeight / 2);
  }

  handleClose = () => {
    this.Morphling.setFormEmptyState();
  }

  handleOpen = () => {
    this.Morphling.setFormFullscreen(3);
  }

  handleNextForm = () => {
    this.Morphling.nextForm();
  }

  handleNextFormTo = () => {
    this.Morphling.nextFormTo(1);
  }

  handleNextImage = () => {
    this.Morphling.nextImg();
  }

  handleNextImageTo = () => {
    this.Morphling.nextImgTo(1);
  }

  handleRestoreTheOriginalForm = () => {
    this.Morphling.restoreTheOriginalForm();
  }

  handleMoveCenter = (e) => {
    this.Morphling.moveCenter(e.clientX, e.clientY);
  }


  handleStartStaticAnimation = () => {
    this.Morphling.startStaticAnimation();
  }

  handleStopStaticAnimation = () => {
    this.Morphling.stopStaticAnimation();
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.controlls}>
          <button className={styles.switchBtn} onClick={this.handlePaused}>Paused</button>
          <button className={styles.switchBtn} onClick={this.handleContune}>Set center</button>
          <button className={styles.switchBtn} onClick={this.handleClose}>Close</button>
          <button className={styles.switchBtn} onClick={this.handleOpen}>Open</button>
          <button className={styles.switchBtn} onClick={this.handleNextForm}>Next</button>
          <button className={styles.switchBtn} onClick={this.handleNextFormTo}>Next To №</button>
          <button className={styles.switchBtn} onClick={this.handleNextImage}>Next Image</button>
          <button className={styles.switchBtn} onClick={this.handleNextImageTo}>
            Next Image To
          </button>
          <button className={styles.switchBtn} onClick={this.handleRestoreTheOriginalForm}>
            Restore original form
          </button>
          <button className={styles.switchBtn} onClick={this.handleStartStaticAnimation}>
            Start s anim
          </button>
          <button className={styles.switchBtn} onClick={this.handleStopStaticAnimation}>
            Stop s anim
          </button>
        </div>
        <img src={img1} alt="" styleName="hidden" />
        <img src={img2} alt="" styleName="hidden" />
        <img src={img3} alt="" styleName="hidden" />
        <canvas ref={(node) => { this.canvas = node; }} id="canvas" />
      </React.Fragment>
    );
  }
}

export default CSSModules(Morph, styles);
