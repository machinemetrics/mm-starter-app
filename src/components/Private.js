import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../utils/request';
import { useLocation } from 'react-router-dom';

const Private = ({ children }) => {
  const location = useLocation();
  const [hasAccessToken, setHasAccessToken] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    setHasAccessToken(!!accessToken);
  }, [location]);

  return hasAccessToken && (
    <>
      { children }
    </>
  );
};

export default Private;
