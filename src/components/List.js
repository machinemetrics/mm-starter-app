import React from 'react';

const Home = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.machineRef}>{JSON.stringify(item)}</li>
      ))}
    </ul>
  );
};

export default Home;
