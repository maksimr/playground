const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = () => /**@type {import('webpack').Configuration}*/({
  output: {
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH
  },
  infrastructureLogging: {
    level: 'warn'
  },
  devServer: {
    allowedHosts: 'all',
    hot: false,
    client: {
      logging: 'warn'
    },
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        loader: require.resolve('babel-loader')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('style-loader')
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: {
                auto: true,
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new (require('webpack').DefinePlugin)({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new (require('html-webpack-plugin'))({
      template: require.resolve('./index.html')
    })
  ]
});
