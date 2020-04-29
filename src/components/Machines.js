import React from 'react';
import { useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import List from './List';
import Message from './Message';

const Home = () => {
  const query = gql`
    subscription {
      Machine {
        name
        machineRef
      }
    }
  `;

  const { loading, error, data } = useSubscription(query);

  return (
    <div>
      {loading && <Message>Loading...</Message>}
      {data && <List items={data.Machine} />}
      {error && (
        <Message>
          An error occured:
          <br />"{error.message}"
        </Message>
      )}
    </div>
  );
};

export default Home;
