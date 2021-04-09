const { resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const config = require('./webpack.base.js');

module.exports = merge(config, {
  entry: resolve(__dirname, './src/server/index.js'),
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
  },
  // target: node 不会将 node 的核心模块打包进来
  target: 'node',
  externals: [nodeExternals()], // 排除 node_modules 目录中所有模块
});
