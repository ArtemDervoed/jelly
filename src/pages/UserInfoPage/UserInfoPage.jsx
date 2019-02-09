import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

import HomePage from '../HomePage';

const UserInfoPage = () => (
  <Fragment>
    <Helmet title="User info" />
    <HomePage />
  </Fragment>
);

export default UserInfoPage;
