module.exports = {
	title: 'revue2 example',
	entry: './example',
	resolve: true,
	dist: 'dist-example',
	mergeConfig: {
		module: {
			rules: [
				{test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}
			]
		}
	}
}
