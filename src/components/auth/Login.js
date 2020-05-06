import React from 'react';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';
import _map from 'lodash/map';
import Logo from '../Logo';

const DEFAULT_SCOPE = 'reporting';

const authState = uuidv4();

const createParamString = params => _map(params, (v, k) => `${k}=${v}`).join('&');

const loginParams = createParamString({
  response_type: 'code',
  state: authState,
  scope: DEFAULT_SCOPE,
  ttl: 1209600,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: `${process.env.REACT_APP_URL}/authorize/mm/callback`,
});

const loginUrl = `${process.env.REACT_APP_LOGIN_URL}/oauth/authorize?${loginParams}`;

const Centered = styled.div`
  text-align: center;
  padding-top: 200px;
`;

const LoginButton = styled.a`
  border-radius: 5px;
  display: inline-block;
  padding: 15px 20px;
  text-decoration: none;
  color: #000;
  border: solid 1px #eee;

  &:hover {
    background-color: #eee;
  }
`;

const LogoContainer = styled.div`
  display: block;
  margin-bottom: 50px;
`;

const Login = ({ location }) => {
  const loadError = location && location.state && location.state.loadError;

  return (
    <Centered>
      { loadError && (<div>{ loadError }</div>) }
      <LogoContainer>
        <Logo width="400px" />
      </LogoContainer>
      <LoginButton href={loginUrl}>Login with MachineMetrics</LoginButton>
    </Centered>
  );
};

export default Login;
