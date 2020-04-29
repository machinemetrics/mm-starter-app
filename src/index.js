import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider }from '@apollo/react-hooks';
import './index.css';
import App from './App';
import client from './client';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  rootElement
);
