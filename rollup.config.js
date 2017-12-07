import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import merge from 'lodash.merge';

const common = {
  input: 'src/index.js',
  name: 'chartjsPluginCustomLines',
  sourcemap: true,
  external: ['lodash.merge'],
  globals: {
    'lodash.merge': '_.merge',
  },
};

const babelOptions = {
  plugins: ['external-helpers'],
  exclude: 'node_modules/**',
};

const lib = merge({}, common, {
  output: {
    format: 'cjs',
    file: 'lib/chartjs-plugin-custom-lines.js',
  },
  plugins: [
    eslint(),
    babel(babelOptions),
  ],
});

const umdDist = merge({}, common, {
  output: {
    format: 'umd',
    file: 'dist/chartjs-plugin-custom-lines.js',
  },
  plugins: [
    eslint(),
    babel(babelOptions),
  ],
});

const minUmdDist = merge({}, common, {
  output: {
    format: 'umd',
    file: 'dist/chartjs-plugin-custom-lines.js',
  },
  plugins: [
    eslint(),
    babel(babelOptions),
    uglify(),
  ],
});

export default [lib, umdDist, minUmdDist];
