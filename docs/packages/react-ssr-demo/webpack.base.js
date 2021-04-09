// base config
module.exports = {
  mode: 'development', // 开发模式

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader', // .babelrc 单独配置 babel
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['>1%', 'last 2 versions', 'not ie <= 8'],
                },
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [['@babel/plugin-transform-runtime', { corejs: 2 }]],
          cacheDirectory: true, // 构建优化 第二次构建时，会读取之前的缓存
        },
      },
    ],
  },
};
