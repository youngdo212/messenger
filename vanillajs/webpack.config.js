const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './src/javascripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: '8080',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
    ]
  }
};

module.exports = (env, argv) => {
  const plugins = config.plugins || [];

  if (argv.mode === 'development') {
    config.plugins = plugins.concat(new HtmlWebpackPlugin({
      templateParameters: {
        'sdkurl': 'http://localhost:8080/sdk/easychat.js',
      },
      template: './src/index.pug',
    }))
  }
  if (argv.mode === 'production') {
    config.plugins = plugins.concat(new HtmlWebpackPlugin({
      templateParameters: {
        'sdkurl': 'https://easychatjs.com/sdk/easychat.js',
      },
      template: './src/index.pug',
    }))
  }

  return config;
}