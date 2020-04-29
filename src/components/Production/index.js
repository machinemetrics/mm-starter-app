import React from 'react';
import moment from 'moment-timezone';
import { useProductionQuery } from '../../utils/hooks';
import Message from '../Message';
import styled from 'styled-components';
import ProductionAggregate from './ProductionAggregate';
import ProductionGraph from './ProductionGraph';

const MINUTE = 60 * 1000;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 5px 15px;
  font-size: 12px;
  background-color: #eee;
  margin: 10px;
  border-radius: 20px;
`;

const Production = () => {
  const start = moment.utc().startOf('day').subtract(30, 'days');
  const end = moment.utc().endOf('day');

  const query = `{
    "start": "${start.format()}",
    "end": "${end.format()}",
    "data": [{
      "metric": "utilizationRate"
    },{
      "metric":"totalParts"
    },{
      "metric": "rejectedParts"
    },{
      "metric": "oee"
    },{
      "metric": "availability"
    },{
      "metric": "timeInCut"
    }],
    "groupBy": [{
      "group": "day"
    }],
    "flatten": true
  }`;

  const { loading, error, data } = useProductionQuery(query, 5 * MINUTE);

  return (
    <div>
      {loading && <Message>Loading...</Message>}
      <ProductionAggregate data={data} loading={loading} />
      <ProductionGraph data={data} metric={'utilizationRate'} loading={loading} />
      <ProductionGraph data={data} metric={'totalParts'} graphType={'bar'} loading={loading} />
      <ProductionGraph data={data} metric={'rejectedParts'} graphType={'bar'} loading={loading} />
      <ProductionGraph data={data} metric={'oee'} graphType={'line'} loading={loading} />
      <ProductionGraph data={data} metric={'availability'} graphType={'line'} loading={loading} />
      <ProductionGraph data={data} metric={'timeInCut'} graphType={'line'} loading={loading} />
      {error && (
        <Message>
          An error occurred:
          <br />"{error.message}"
        </Message>
      )}
      <Footer>Refreshes every 5 minutes</Footer>
    </div>
  );
};

export default Production;
