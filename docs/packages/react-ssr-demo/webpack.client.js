const { resolve } = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');

module.exports = merge(config, {
  entry: resolve(__dirname, './src/client/index.js'),
  output: {
    filename: 'index.js',
    path: resolve(__dirname, 'public'),
  },
});
