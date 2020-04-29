const ACCESS_TOKEN_KEY = 'access-token';
let JWT;

export const setAccessToken = (accessToken) => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const getAccessToken = () => {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const hasAccessToken = () => {
  return !!getAccessToken();
};

export const getJwt = async () => {
  if (JWT) {
    return JWT;
  }

  return await refreshJwt();
};

export const refreshJwt = async () => {
  if (!hasAccessToken()) {
    return;
  }

  const response = await request(`${process.env.REACT_APP_API_URL}/user-token?graphql=1`);
  JWT = response;
  return response;
};

export const removeJwt = () => {
  JWT = undefined;
};

export const request = async (url, options = {}) => {
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAccessToken()}`,
  };

  return rawRequest(url, options);
};

export const rawRequest = async (url, options) => {
  const response = await fetch(
    url,
    options
  );

  const text = await response.text();
  const obj = JSON.parse(text);

  if (response.status >= 200 && response.status < 300) {
    return obj;
  }

  if (response.status === 401) {
    removeAccessToken();
    window.location = '/login';
  }

  const error = new Error(response.statusText);
  error.json = obj;
  throw error;
};

export default request;
