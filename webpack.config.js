var webpack = require('webpack');
var path = require('path');

module.exports = {
  debug: true,
  context: path.join(__dirname, 'app'),
  entry: './main',
  output: {
    path: path.join(__dirname, 'public', 'script'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
