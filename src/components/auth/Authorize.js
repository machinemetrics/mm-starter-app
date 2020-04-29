import React, { useState } from 'react';
import { useAsyncEffect } from '../../utils/hooks';
import qs from 'query-string';
import Authorized from './Authorized';
import Message from '../Message';
import { rawRequest, setAccessToken } from '../../utils/request';

const Authorize = (props) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useAsyncEffect(async (abortSignal) => {
    const code = qs.parse(window.location.search).code;

    const params = {
      grant_type: 'authorization_code',
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.REACT_APP_URL}/authorize/mm/callback`,
    };

    try {
      const response = await rawRequest(
        `${process.env.REACT_APP_LOGIN_URL}/oauth/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: new URLSearchParams(params),
          signal: abortSignal,
        }
      );
      setAccessToken(response.access_token);
    } catch (e) {
      console.log(e);
      setLoadError(`Login Failed. Try again.`);
    }

    setLoading(false);
  }, []);

  return loading ? (
    <Message>Authorizing...</Message>
  ) : (
    <Authorized loadError={loadError} />
  );
};

export default Authorize;
