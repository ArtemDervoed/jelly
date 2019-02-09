
import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';

import config from '../config';
// Import your global styles here
import 'normalize.css/normalize.css';
import styles from './App.scss';

const App = ({ route }) => (
  <div className={styles.App}>
    <Helmet {...config.app} />
    {renderRoutes(route.routes)}
  </div>
);

App.propTypes = {
  route: PropTypes.object,
};

export default hot(module)(App);
