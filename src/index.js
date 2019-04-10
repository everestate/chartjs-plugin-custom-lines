import merge from 'lodash/merge';

import drawCustomLines from './drawCustomLines';

const defaultOptions = {
  customLinesPlugin: {
    enabled: true,
    startColorStop: 0,
    endColorStop: 0.6,
    startColor: 'rgba(0, 0, 0, 0.55)', // opaque
    endColor: 'rgba(0, 0, 0, 0)', // transparent
  },
};

const status = {};

const waterFallPlugin = {
  beforeInit: (chart) => {
    status[chart.id] = {
      readyToDrawCustomLines: false,
    };
  },
  afterInit: (chart) => {
    chart.options.plugins = merge({}, defaultOptions, chart.options.plugins);

    // Can't override onComplete function because it gets overwridden if user using React
    setTimeout(() => {
      status[chart.id].readyToDrawCustomLines = true;
      if (chart.ctx !== null) {
        chart.draw();
      }
    }, chart.options.animation.duration);
  },
  afterDraw: (chart) => {
    const options = chart.options.plugins.customLinesPlugin;

    if (options.enabled &&
        status[chart.id].readyToDrawCustomLines) {
      drawCustomLines(chart);
    }
  },
};

export default waterFallPlugin;
