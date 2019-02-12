import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Morph.scss';
import Morphling from './Morphling';
import {
  firstFigureRadiuses,
  secondFigureRadiuses,
  thirdFigureRadiuses,
  fourthFigureRadiuses,
} from '_data/figures';
import img1 from '_images/1.jpg';
import img2 from '_images/2.jpg';
import img3 from '_images/3.jpg';

class Morph extends React.Component {
  constructor() {
    super();
    this.morphling = null;
    this.Morphling = new Morphling([
      firstFigureRadiuses,
      secondFigureRadiuses,
      thirdFigureRadiuses,
      fourthFigureRadiuses,
    ]);
  }

  componentDidMount() {
    const images = document.getElementsByClassName(styles.hidden);
    this.Morphling.init('canvas');
    this.Morphling.setImages(images);
    this.Morphling.changeFigure();
    this.Morphling.render();
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

  handleNextImage = () => {
    this.Morphling.nextImg();
    console.log('click');
  }

  render() {
    console.log('render');
    return (
      <React.Fragment>
        <div className={styles.controlls}>
          <button className={styles.switchBtn} onClick={this.handlePaused}>Paused</button>
          <button className={styles.switchBtn} onClick={this.handleContune}>Start</button>
          <button className={styles.switchBtn} onClick={this.handleClose}>Close</button>
          <button className={styles.switchBtn} onClick={this.handleOpen}>Open</button>
          <button className={styles.switchBtn} onClick={this.handleNextForm}>Next</button>
          <button className={styles.switchBtn} onClick={this.handleNextImage}>Next Image</button>
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
