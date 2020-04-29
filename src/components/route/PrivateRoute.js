import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAccessToken } from '../../utils/request';

function isAuthenticated() {
  return !!getAccessToken();
}

const PrivateRoute = ({ component, ...props }) => {
  return isAuthenticated()
    ? <Route
      { ...props }
      component={component}
    />
    : <Redirect to="/login" />;
};

export default PrivateRoute;
