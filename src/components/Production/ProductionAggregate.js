import React from 'react';
import map from 'lodash/map';
import styled from 'styled-components';
import { getInfo } from './DataMap';

const BorderColor = '#ccc';
const FontColor = '#333';

const Row = styled.div`
  color: ${FontColor};
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Cell = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  border: solid 1px ${BorderColor};
`;

const Title = styled.h1`
  margin: 0;
  padding: 5px 10px;
  border-bottom: solid 1px ${BorderColor};
  text-align: center;
`;

const Body = styled.div`
  padding: 30px 20px;
  text-align: center;
  font-size: 30px;
`;

const ProductionAggregate = ({ data, loading }) => {
  return (
    <>
      {
        data && !loading &&
        <Row>
          {
            map(data.aggregate, (value, key) => {
              const info = getInfo(key);
              return <Cell key={key}>
                <Title>{info.title}</Title>
                <Body>{info.transform(value)}{info.unit}</Body>
              </Cell>;
            })
          }
        </Row>
      }
    </>
  );
};

export default ProductionAggregate;
