import React from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment-timezone';
import { getInfo } from './DataMap';
import styled from 'styled-components';

const BorderColor = '#ccc';

const Panel = styled.div`
  padding: 0;
  margin: 20px 10px 45px 10px;
  border-radius: 5px;
  border: solid 1px ${BorderColor};
`;

const Title = styled.h1`
  margin: 0;
  padding: 5px 10px;
  font-size: 20px;
  border-bottom: solid 1px ${BorderColor};
`;

const Body = styled.div`
  padding: 0;
  text-align: center;
  font-size: 30px;
`;

const ProductionGraph = ({ data, loading, metric, graphType = 'line' }) => {
  const info = getInfo(metric);

  const option = {
    animation: false,
    xAxis: {
      type: 'category',
      data:
        data && data.items
          ? data.items.map(item => moment.utc(item.day).format('MMM D'))
          : [],
      axisLabel: {
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data:
          data && data.items
            ? data.items.map(item => {
              return info.transform(item[metric]);
            })
            : [],
        type: graphType,
      },
    ],
  };

  return (
    <>
      {
        data && !loading &&
        <Panel>
          <Title>{info.title}</Title>
          <Body>
            <ReactEcharts option={option} />
          </Body>
        </Panel>
      }
    </>
  );
};

export default ProductionGraph;
