import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { getJwt, removeJwt } from './utils/request';
import ApolloClient from 'apollo-client';

const wsLink = new WebSocketLink({
  uri: `wss://${process.env.REACT_APP_GRAPHQL_PATH}`,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const jwt = await getJwt();
      return {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      };
    },
  },
});

const errorLink = onError(
  ({ operation, networkError, graphQLErrors, forward }) => {
    const definition = getMainDefinition(operation.query);
    if (definition.operation === 'subscription' && networkError) {
      removeJwt();
      wsLink.subscriptionClient.close(false, false);
    }

    graphQLErrors &&
      graphQLErrors.forEach(err => {
        if (err.extensions.code === 'invalid-jwt') {
          removeJwt();
        }
      });

    return forward(operation);
  }
);

const authLink = setContext(async (_, { headers }) => {
  const jwt = await getJwt();

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${jwt}`,
    },
  };
});

const httpLink = authLink.concat(
  createHttpLink({
    uri: `https://${process.env.REACT_APP_GRAPHQL_PATH}`,
    fetch,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const link = ApolloLink.from([errorLink, splitLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
