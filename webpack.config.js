const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = () => /**@type {import('webpack').Configuration}*/({
  output: {
    filename: '[name].[contenthash].js',
    publicPath: ASSET_PATH
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
        test: /\.(j|t)s(x)?$/,
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
  resolve: {
    extensions: ['', '.js', '.json', '.wasm', '.tsx', '.ts'],
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
