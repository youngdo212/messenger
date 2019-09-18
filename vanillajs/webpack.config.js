const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
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
    config.entry = './src/javascripts/index.template.js',
    config.plugins = plugins.concat(new HtmlWebpackPlugin({
      templateParameters: {
        'sdkurl': 'http://localhost:3000/sdk/easychat.js',
      },
      template: './src/index.pug',
    }))
  }
  if (argv.mode === 'production') {
    config.entry = './src/javascripts/index.js',
    config.plugins = plugins.concat(new HtmlWebpackPlugin({
      templateParameters: {
        'sdkurl': 'https://easychatjs.com/sdk/easychat.js',
      },
      template: './src/index.pug',
    }))
  }

  return config;
}