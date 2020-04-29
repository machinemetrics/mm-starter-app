import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  margin: 20px;
`;

const Home = () => {
  return (
    <Panel>
      <h1>
        Welcome!
      </h1>
      <p>
        There are some basic tools at the top. Poke around.
      </p>
    </Panel>
  );
};

export default Home;
