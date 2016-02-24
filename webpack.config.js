var webpack = require('webpack');
var path = require('path');

var plugins = [
	new webpack.optimize.OccurenceOrderPlugin(),
	new webpack.NoErrorsPlugin()
];

if (process.env.PROD) {
	plugins = plugins.concat(
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				except: ['$super', '$', 'exports', 'require']
			}
		}))
}

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
	plugins: plugins
};
