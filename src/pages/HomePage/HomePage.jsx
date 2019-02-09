import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import Morph from './Morph';

const HomePage = () => (
  <Fragment>
    <Helmet title="Home" />
    { !__SERVER__ && <Morph />}
    <Link to="/users/1">Go Bla</Link>
  </Fragment>
);

export default HomePage;
