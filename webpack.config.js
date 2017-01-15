var webpack = require('webpack');

module.exports ={
	entry: [

			'./src/client.js'
	],
	output: {
		filename: "bundle.js",
		path: "./dist",
		publicPath: 'http://localhost:7788/'
	},
	module: {
		loaders: [
			{
				test: /\.js/,
				exclude: /node_modules\/(?!(three)\/).*/,
				loaders: ['babel']
			},
			{
				test: /\.jsx/,
				exclude: /node_modules/,
				loaders: ['babel']
			},
			{
				test: /\.scss/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.css/,
				loaders: ["style-loader", "css-loader"]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			'THREE': 'three/build/three.min.js',
			'CANNON': 'cannon/build/cannon.min.js',
		})
	],
	devServer: {
			contentBase: './dist/',
			publicPath: 'http://localhost:7788/',
	    proxy: [{
	    	path: '/api/*',
	    	target: 'http://localhost:3002'
	    }]
	}
}
