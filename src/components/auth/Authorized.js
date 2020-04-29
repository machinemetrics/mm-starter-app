import React from 'react';
import { Redirect } from 'react-router-dom';

const Done = ({ loadError }) => {
  return loadError ? (
    <Redirect to={{
      pathname: '/login',
      state: { loadError: loadError },
      }}
    />
  ) : (
    <Redirect to="/" />
  );
};

export default Done;
