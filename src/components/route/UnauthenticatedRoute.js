import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAccessToken } from '../../utils/request';

function isAuthenticated() {
  return !!getAccessToken();
}

const UnauthenticatedRoute = ({ component, ...props }) => {
  return !isAuthenticated()
    ? <Route
      { ...props }
      component={component}
    />
    : <Redirect to="/" />;
};

export default UnauthenticatedRoute;
