const errorChecking = (line) => {
  if (!Object.prototype.hasOwnProperty.call(line, 'from')) {
    throw new Error('The \'from\' property must be specified for each line');
  }

  if (!Object.prototype.hasOwnProperty.call(line, 'to')) {
    throw new Error('The \'to\' property must be specified for each line');
  }

  if (!Object.prototype.hasOwnProperty.call(line.from, 'stackIndex')) {
    throw new Error('The \'stackIndex\' property must be specified for the \'from\' property');
  }

  if (!Object.prototype.hasOwnProperty.call(line.to, 'stackIndex')) {
    throw new Error('The \'stackIndex\' property must be specified for the \'to\' property');
  }
};

const transformTopPoints = (datapointValues, top) => {
  switch (top) {
    case 'BR':
      return {
        ...datapointValues,
        stackTRPos: datapointValues.stackBRPos,
      };
    case 'BL':
      return {
        ...datapointValues,
        stackTLPos: datapointValues.stackBLPos,
      };
    case 'TR':
      return {
        ...datapointValues,
        stackTLPos: datapointValues.stackTRPos,
      };
    case 'TL':
      return {
        ...datapointValues,
        stackTRPos: datapointValues.stackTLPos,
      };
    default:
      return datapointValues;
  }
};

const transformBottomPoints = (datapointValues, bottom) => {
  switch (bottom) {
    case 'BR':
      return {
        ...datapointValues,
        stackBLPos: datapointValues.stackBRPos,
      };
    case 'BL':
      return {
        ...datapointValues,
        stackBRPos: datapointValues.stackBLPos,
      };
    case 'TR':
      return {
        ...datapointValues,
        stackBRPos: datapointValues.stackTRPos,
      };
    case 'TL':
      return {
        ...datapointValues,
        stackBRPos: datapointValues.stackTLPos,
      };
    default:
      return datapointValues;
  }
};

const transformPoints = (datapointValues, points = {}) => {
  const transformedTopPoints = transformTopPoints(datapointValues, points.top);
  const transformedPoints = transformBottomPoints(transformedTopPoints, points.bottom);

  return transformedPoints;
};

const drawCustomLine = (context, fromDatapointValues, toDatapointValues, line, options) => {
  // Specific line options take priority over global if they are specified
  const startColor = line.startColor || options.startColor;
  const endColor = line.endColor || options.endColor;
  const startColorStop = line.startColorStop || options.startColorStop;
  const endColorStop = line.endColorStop || options.endColorStop;

  let y0 = toDatapointValues.stackTLPos.y;
  let y1 = toDatapointValues.stackBLPos.y;

  if (line.reverseGradient) {
    y0 = toDatapointValues.stackBLPos.y;
    y1 = toDatapointValues.stackTLPos.y;
  }

  // Gradient from top of second box to bottom of second box
  const gradient = context.createLinearGradient(0, y0, 0, y1);

  gradient.addColorStop(startColorStop, startColor);
  gradient.addColorStop(endColorStop, endColor);

  context.fillStyle = gradient;

  context.beginPath();

  const fromTrasnformedDatapointValues = transformPoints(fromDatapointValues, line.from.points);
  const toTrasnformedDatapointValues = transformPoints(toDatapointValues, line.to.points);

  // top right of first box
  context.lineTo(fromTrasnformedDatapointValues.stackTRPos.x, fromTrasnformedDatapointValues.stackTRPos.y);
  // top left of second box
  context.lineTo(toTrasnformedDatapointValues.stackTLPos.x, toTrasnformedDatapointValues.stackTLPos.y);
  // bottom left of second box
  context.lineTo(toTrasnformedDatapointValues.stackBLPos.x, toTrasnformedDatapointValues.stackBLPos.y);
  // bottom right of first box
  context.lineTo(fromTrasnformedDatapointValues.stackBRPos.x, fromTrasnformedDatapointValues.stackBRPos.y);

  context.fill();
};

export default (chart) => {
  const context = chart.ctx;
  const datasets = { ...chart.data.datasets };
  const options = chart.options.plugins.customLinesPlugin;

  if (!Object.prototype.hasOwnProperty.call(options, 'lines')) {
    throw new Error('The \'lines\' property must be specified');
  }

  const getModel = (dataset) => {
    const firstKey = Object.keys(dataset._meta)[0];

    return dataset._meta[firstKey].data[0]._model;
  };

  const datapoints = Object.keys(datasets).map((key) => {
    const dataset = datasets[key];
    const model = getModel(dataset);

    return {
      stackBRPos: { x: model.x + (model.width / 2), y: model.base },
      stackBLPos: { x: model.x - (model.width / 2), y: model.base },
      stackTRPos: { x: model.x + (model.width / 2), y: model.y },
      stackTLPos: { x: model.x - (model.width / 2), y: model.y },
    };
  });

  options.lines.forEach((line) => {
    errorChecking(line);

    drawCustomLine(context, datapoints[line.from.stackIndex], datapoints[line.to.stackIndex], line, options);
  });
};
