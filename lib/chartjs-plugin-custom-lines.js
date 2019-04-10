'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var merge = _interopDefault(require('lodash/merge'));

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var errorChecking = function errorChecking(line) {
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

var transformTopPoints = function transformTopPoints(datapointValues, top) {
  switch (top) {
    case 'BR':
      return _extends({}, datapointValues, {
        stackTRPos: datapointValues.stackBRPos
      });
    case 'BL':
      return _extends({}, datapointValues, {
        stackTLPos: datapointValues.stackBLPos
      });
    case 'TR':
      return _extends({}, datapointValues, {
        stackTLPos: datapointValues.stackTRPos
      });
    case 'TL':
      return _extends({}, datapointValues, {
        stackTRPos: datapointValues.stackTLPos
      });
    default:
      return datapointValues;
  }
};

var transformBottomPoints = function transformBottomPoints(datapointValues, bottom) {
  switch (bottom) {
    case 'BR':
      return _extends({}, datapointValues, {
        stackBLPos: datapointValues.stackBRPos
      });
    case 'BL':
      return _extends({}, datapointValues, {
        stackBRPos: datapointValues.stackBLPos
      });
    case 'TR':
      return _extends({}, datapointValues, {
        stackBRPos: datapointValues.stackTRPos
      });
    case 'TL':
      return _extends({}, datapointValues, {
        stackBRPos: datapointValues.stackTLPos
      });
    default:
      return datapointValues;
  }
};

var transformPoints = function transformPoints(datapointValues) {
  var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var transformedTopPoints = transformTopPoints(datapointValues, points.top);
  var transformedPoints = transformBottomPoints(transformedTopPoints, points.bottom);

  return transformedPoints;
};

var drawCustomLine = function drawCustomLine(context, fromDatapointValues, toDatapointValues, line, options) {
  // Specific line options take priority over global if they are specified
  var startColor = line.startColor || options.startColor;
  var endColor = line.endColor || options.endColor;
  var startColorStop = line.startColorStop || options.startColorStop;
  var endColorStop = line.endColorStop || options.endColorStop;

  var y0 = toDatapointValues.stackTLPos.y;
  var y1 = toDatapointValues.stackBLPos.y;

  if (line.reverseGradient) {
    y0 = toDatapointValues.stackBLPos.y;
    y1 = toDatapointValues.stackTLPos.y;
  }

  // Gradient from top of second box to bottom of second box
  var gradient = context.createLinearGradient(0, y0, 0, y1);

  gradient.addColorStop(startColorStop, startColor);
  gradient.addColorStop(endColorStop, endColor);

  context.fillStyle = gradient;

  context.beginPath();

  var fromTrasnformedDatapointValues = transformPoints(fromDatapointValues, line.from.points);
  var toTrasnformedDatapointValues = transformPoints(toDatapointValues, line.to.points);

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

var drawCustomLines = (function (chart) {
  var context = chart.ctx;
  var datasets = _extends({}, chart.data.datasets);
  var options = chart.options.plugins.customLinesPlugin;

  if (!Object.prototype.hasOwnProperty.call(options, 'lines')) {
    throw new Error('The \'lines\' property must be specified');
  }

  var getModel = function getModel(dataset) {
    var firstKey = Object.keys(dataset._meta)[0];

    return dataset._meta[firstKey].data[0]._model;
  };

  var datapoints = Object.keys(datasets).map(function (key) {
    var dataset = datasets[key];
    var model = getModel(dataset);

    return {
      stackBRPos: { x: model.x + model.width / 2, y: model.base },
      stackBLPos: { x: model.x - model.width / 2, y: model.base },
      stackTRPos: { x: model.x + model.width / 2, y: model.y },
      stackTLPos: { x: model.x - model.width / 2, y: model.y }
    };
  });

  options.lines.forEach(function (line) {
    errorChecking(line);

    drawCustomLine(context, datapoints[line.from.stackIndex], datapoints[line.to.stackIndex], line, options);
  });
});

var defaultOptions = {
  customLinesPlugin: {
    enabled: true,
    startColorStop: 0,
    endColorStop: 0.6,
    startColor: 'rgba(0, 0, 0, 0.55)', // opaque
    endColor: 'rgba(0, 0, 0, 0)' // transparent
  }
};

var status = {};

var waterFallPlugin = {
  beforeInit: function beforeInit(chart) {
    status[chart.id] = {
      readyToDrawCustomLines: false
    };
  },
  afterInit: function afterInit(chart) {
    chart.options.plugins = merge({}, defaultOptions, chart.options.plugins);

    // Can't override onComplete function because it gets overwridden if user using React
    setTimeout(function () {
      status[chart.id].readyToDrawCustomLines = true;
      if (chart.ctx !== null) {
        chart.draw();
      }
    }, chart.options.animation.duration);
  },
  afterDraw: function afterDraw(chart) {
    var options = chart.options.plugins.customLinesPlugin;

    if (options.enabled && status[chart.id].readyToDrawCustomLines) {
      drawCustomLines(chart);
    }
  }
};

module.exports = waterFallPlugin;
//# sourceMappingURL=chartjs-plugin-custom-lines.js.map
