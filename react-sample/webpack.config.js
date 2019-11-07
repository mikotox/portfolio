const path = require('path');

module.exports = {
	entry: './src/js/app.js',
	//追加
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js'
	}
};

