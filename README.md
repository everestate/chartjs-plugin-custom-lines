# chartjs-plugin-custom-lines
Custom lines that can be drawn from bar to bar for bar charts.

### Installation
`npm install --save chartjs-plugin-custom-lines`

### Usage
Just import the plugin and add it to any bar chart:

`import customLinesPlugin from 'chartjs-plugin-custom-lines';`

```js
var chart = new Chart(ctx, {
    plugins: [customLinesPlugin]
});
```

See the [plugins](http://www.chartjs.org/docs/latest/developers/plugins.html) documentation for more info.

### Example
```js
options: {
  plugins: {
    customLinesPlugin: {
      startColor: `rgba(${0xd2}, ${0x9b}, ${0xaf}, 0.55`,
      endColor: `rgba(${0xd2}, ${0x9b}, ${0xaf}, 0`,
      lines: [{
        reverseGradient: true,
        from: {
          stackIndex: 2,
          top: 'TR',
          bottom: 'BL',
        },
        to: {
          stackIndex: 4,
          top: 'TR',
          bottom: 'BR',
        },
      }],
    },
  },
},
```

### Options
The plugin options can be changed at 3 different levels:

globally: Chart.defaults.global.plugins.customLinesPlugin.*

per chart: options.plugins.customLinesPlugin.*

per line: options.plugins.customLinesPlugin.lines.*

The default chart options are:

```js
options: {
  plugins: {
    customLinesPlugin: {
      stepLines: {
      enabled: true,
      startColorStop: 0,
      endColorStop: 0.6,
      startColor: 'rgba(0, 0, 0, 0.55)', // opaque
      endColor: 'rgba(0, 0, 0, 0)', // transparent
      },
    },
  },
}
```

Global/Chart options:

`enabled`: ([Boolean]) If true then it shows the custom-lines going from one bar to another.

`startColorStop`: ([Number]) Used as the offset value in the first [`addColorStop`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop) method call.

`startColor`: ([String]) Used as the color value in the first [`addColorStop`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop) method call.

`endColorStop`: ([Number]) Used as the offset value in the second [`addColorStop`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop) method call.

`endColor`: ([String]) Used as the color value in the second [`addColorStop`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient/addColorStop) method call.

Per Line options:

`line.reverseGradient`: ([Boolean]) If true then reverses the direction of the gradient from down to up

`line.from`: (Object)

`line.from.stackIndex`: (Number) The dataset index to draw the line from
  
`line.from.points`: ([Object])

`line.from.points.top`: (String) Specifies the top point to draw the line from.

`line.from.points.bottom`: (String) Specifies the bottom point to draw the line from.

`line.to`: (Object)

`line.to.stackIndex`: (Number) The dataset index to draw the line to

`line.to.points`: ([Object])

`line.to.points.top`: (String) Specifies the top point to draw the line to.

`line.to.points.bottom`: (String) Specifies the bottom point to draw the line to.

By default this plugin draws from top right -> top left and bottom right -> bottom left.

The `top` and `bottom` points properties accept the following strings:

- `TR` Specifies that the line should start or end at the top right.
- `TL` Specifies that the line should start or end at the top left.
- `BR` Specifies that the line should start or end at the bottom right.
- `BL` Specifies that the line should start or end at the bottom left.

### Caveats
- Multiple values in `data` currently are not supported by this plugin.
