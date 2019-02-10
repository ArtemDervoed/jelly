import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Morph.scss';
import Morphling from './Morphling';
import { path1, path2, path3 } from '_data/figures';
import img1 from '_images/1.jpg';
import img2 from '_images/2.jpg';
import img3 from '_images/3.jpg';

class Morph extends React.Component {
  constructor() {
    super();
    this.morphling = null;
    this.Morphling = new Morphling(
      [path1, path2, path3],
      [img1, img2, img3],
      path1,
    );
  }

  componentDidMount() {
    this.Morphling.init('canvas');
    this.Morphling.render();
  }

  shouldComponentUpdate = () => false;

  handlePaused = () => {
    console.log('click');
  }

  handleContune = () => {
    console.log('click');
  }

  handleClose = () => {
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
        <canvas ref={(node) => { this.canvas = node; }} id="canvas" />
      </React.Fragment>
    );
  }
}

export default CSSModules(Morph, styles);
