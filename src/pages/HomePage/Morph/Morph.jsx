import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Morph.scss';
import Morphling from './Morphling';
import { elipsMoreDots } from '_data/figures';
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
    this.Morphling.setOffset((window.innerWidth / 2) + 250, (window.innerHeight / 2) - 250);
    const figure1 = this.generateFigure(elipsMoreDots);
    const figure2 = this.generateFigure(elipsMoreDots);
    const figure3 = this.generateFigure(elipsMoreDots);
    const figure4 = this.generateFigure(elipsMoreDots);
    const big = this.generateBigFigure(elipsMoreDots);
    this.Morphling.init(
      'canvas',
      [figure1, figure2, figure3, figure4],
      images,
      figure1,
      big,
    );
    this.Morphling.setEmptyFigure(elipsMoreDots.length);
    this.Morphling.render();
  }

  shouldComponentUpdate = () => false;

  getRandomInt = (min, max) => {
    min = Math.ceil(min); // eslint-disable-line
    max = Math.floor(max); // eslint-disable-line
    return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line
  }

  generateBigFigure = (inputElips) => {
    const figere = [];
    for (let i = 0; i < elipsMoreDots.length - 1; i += 2) {
      figere.push((inputElips[i] * 20) - (window.innerWidth * 2));
      figere.push((inputElips[i + 1] * 20) - (window.innerHeight * 2));
    }
    return figere;
  }

  generateFigure = (inputElips) => {
    const figere = [];
    for (let i = 0; i < elipsMoreDots.length - 1; i += 2) {
      const shift = 100; // this.getRandomInt(-30, 30);
      // const a = 2 * Math.sqrt(shift * shift);
      figere.push(inputElips[i] + shift);
      figere.push(inputElips[i + 1] + shift);
    }
    return figere;
  }

  handlePaused = () => {
    console.log('click');
  }

  handleContune = () => {
    console.log('click');
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
