import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import _ from 'lodash';
import { useDowntimeQuery } from '../../utils/hooks';
import Message from '../Message';
import styled from 'styled-components';
import ProductionGraph from '../Production/ProductionGraph';

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

const Downtime = () => {
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
    }, {
      "group": "reason"
    }],
    "flatten": true
  }`;

  const { loading, error, data } = useDowntimeQuery(query);
  const [ filteredData, setFilteredData ] = useState();
  const [ reasons, setReasons ] = useState([]);
  const [ selectedReason, setSelectedReason ] = useState('all');

  useEffect(() => {
    if (!data || _.isEmpty(data.items)) {
      return setFilteredData([]);
    }

    const reasons = _(data.items)
      .map('reason')
      .uniq()
      .value();

    const days = _(data.items)
      .groupBy('day')
      .mapValues((rows) => {
        const modifiedReasons = _.map(rows, (row) => {
          const downtimeMs = (
            selectedReason === 'all' ||
            (selectedReason === 'categorized' && row.reason !== 'Uncategorized') ||
            selectedReason === row.reason) ?
            row.downtimeMs :
            0;

          return {
            ...row,
            downtimeMs: downtimeMs,
          };
        });

        return {
          downtimeMs: _.sumBy(modifiedReasons, 'downtimeMs'),
          day: _.first(modifiedReasons).day,
        };
      })
      .values()
      .value();

    setReasons(reasons);
    setFilteredData({ items: days });
  }, [data, selectedReason]);

  const handleChange = (event) => {
    setSelectedReason(event.target.value);
  }

  return (
    <div>
      {loading && <Message>Loading...</Message>}
      <select onChange={handleChange}>
        <option value="all">All Downtime</option>
        <option value="categorized">All Categorized</option>
        {reasons.map((reason) => {
          return <option key={reason} value={reason}>{reason}</option>;
        })}
      </select>
      <ProductionGraph data={filteredData} graphType="bar" metric={'downtimeMs'} loading={loading} />
      {error && (
        <Message>
          An error occurred:
          <br />"{error.message}"
        </Message>
      )}
      <Footer>Data is up to 4 hours behind realtime</Footer>
    </div>
  );
};

export default Downtime;
