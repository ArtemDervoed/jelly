import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Morph.scss';
import Morphling from './Morphling';
import { fullScreenRadiuses } from '_data/figures';

import img1 from '_images/1.jpg';
import img2 from '_images/2.jpg';
import img3 from '_images/3.jpg';

class Morph extends React.Component {
  constructor() {
    super();
    this.morphling = null;
    this.Morphling = new Morphling(fullScreenRadiuses);
  }

  componentDidMount() {
    const images = document.getElementsByClassName(styles.hidden);
    const svgf1 = document.getElementById('f1');
    const svgf2 = document.getElementById('f2');
    const svgf3 = document.getElementById('f3');
    const svgf4 = document.getElementById('f4');
    this.Morphling.init('canvas');
    this.Morphling.setFigures([svgf4, svgf1, svgf2, svgf3]);
    this.Morphling.setImages(images);
    this.Morphling.changeFigure();
    this.Morphling.render();
    this.canvas.addEventListener('click', this.handleMoveCenter);
  }

  shouldComponentUpdate = () => false;

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  handlePaused = () => {
    console.log('click');
  }

  handleContune = () => {
    this.Morphling.setCenter(window.innerWidth / 2, window.innerHeight / 2);
    console.log('click 1');
  }

  handleClose = () => {
    this.Morphling.setFormEmptyState();
    console.log('click');
  }

  handleOpen = () => {
    this.Morphling.setFormFullscreen();
    console.log('click');
  }

  handleNextForm = () => {
    this.Morphling.nextForm();
  }

  handleNextFormTo = () => {
    this.Morphling.nextFormTo(1);
  }

  handleNextImage = () => {
    this.Morphling.nextImg();
    console.log('click');
  }

  handleNextImageTo = () => {
    this.Morphling.nextImgTo(1);
    console.log('click');
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
        <svg styleName="hidden-svg" id="f1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187.37 195.03">
          <path d="M90.93,194.29c-22.28.65-55,1.6-74.92-21.84-11.88-13.94-20.59-38-12.14-55.51,8.69-18,29.45-16.48,32.46-31.55,3.14-15.75-18.17-24.15-16.68-41.56,1.62-19,28.78-30.82,36.7-34.28C83.81-2.43,129.07-6.28,158.89,22c19.84,18.81,23.45,43,25.78,58.54,2.12,14.16,9.23,61.72-22.14,91.62C140.81,192.84,112.64,193.66,90.93,194.29Z" />
        </svg>
        <svg styleName="hidden-svg" id="f2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188.21 194.57">
          <path d="M116.33,186.31c-6.58,2.78-36,15.18-64.21,1.31-20.18-9.93-28.93-28-37.39-45.44C12.57,137.72,2.65,116.63,1.16,86.3,0,62.4-1,42.67,11.17,26.54,26.77,5.84,54.33,3.9,86.09,1.66,112.9-.23,138.76-2,160.57,15.46c16.11,12.93,21.82,29.83,23.51,35,12.17,37.63-9.32,72.51-19.42,88.88C155.24,154.67,142.56,175.26,116.33,186.31Z" />
        </svg>
        <svg styleName="hidden-svg" id="f3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176.54 189.36">
          <path d="M152.88,171.29C142.17,193,95,190,73.1,186.15,62,184.2,12,175.37,4.54,146.72-.54,127,20.23,120.11,21.23,90.6,22.42,55.25-6.54,40,2.12,20.52c6.7-15,30.4-20.1,45.2-20C81.05.69,87,27.62,130.44,36.9c26.38,5.64,40-.91,44.59,7.59,7.65,14.29-30.53,33.69-32.46,72.5C141.16,145.34,160.49,155.88,152.88,171.29Z" />
        </svg>
        <svg styleName="hidden-svg" id="f4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 610.91 658.69">
          <path d="M15.75,341.41c40.67-63,134.59-30.42,165.12-85.57C211.74,200.08,130,141,153.63,81.88c36.37-91.11,296-115.25,356.85-23,36.8,55.81-25.78,113.82,14.87,217.63,29.74,76,75.18,75.39,83.8,135.17,12,83-63.68,166.49-127.06,205.46-67,41.23-134.27,41.11-186.49,41-50.78-.09-105.39-.18-163.6-34.26C53.12,577.73,25.21,502.83,19.81,487.39,8,453.55-14.76,388.63,15.75,341.41Z" />
        </svg>
        <canvas ref={(node) => { this.canvas = node; }} id="canvas" />
      </React.Fragment>
    );
  }
}

export default CSSModules(Morph, styles);
