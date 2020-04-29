const DataMap = {
  utilizationRate: {
    title: 'Utilization',
    transform: rate => (rate * 100).toFixed(1),
    unit: '%',
  },
  totalParts: {
    title: 'Total Parts',
  },
  rejectedParts: {
    title: 'Rejected Parts',
  },
  oee: {
    title: 'OEE',
    transform: rate => (rate * 100).toFixed(1),
    unit: '%',
  },
  availability: {
    title: 'Availability',
    transform: rate => (rate * 100).toFixed(1),
    unit: '%',
  },
  timeInCut: {
    title: 'In Cut Hours',
    transform: ms => (ms / 1000 / 60 / 60).toFixed(1),
    unit: 'hrs',
  },
  downtimeMs: {
    title: 'Downtime',
    transform: ms => (ms / 1000 / 60 / 60).toFixed(1),
    unit: 'hrs',
  }
};

export const getInfo = (key) => {
  const info = DataMap[key] || {};
  return {
    title: info.title || key,
    transform: info.transform || (val => val),
    unit: info.unit || '',
  };
};

export default DataMap;
