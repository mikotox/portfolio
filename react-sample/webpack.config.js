const path = require('path'); //パスをrequireする
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //プラグインを追加

module.exports = {
	entry: './src/js/app.js',
	output: {
		//絶対パスが必要
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js'
	},
	//追加
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						//Babelの実行と同時にReactのコードも変換できるようにpresetにreactを追加
						presets: ['babel-preset-env', 'react']
					}
				}
			},
			{
				test: /\.css$/,
				//.cssで出力するプラグイン
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader'
				})
			}	
		]
	},
	//プラグインを実行してstyle.cssを出力する
	plugins: [
		new ExtractTextPlugin('../css/style.css')
	],
	//.js, .cssの記述省略するresolve
	resolve: {
		extensions: ['.js', '.css']
	},
	//開発用サーバーを立てる
	devServer: {
		contentBase: path.join(__dirname, '/'),
		historyApiFallback: true,
		port: 3000
	},
};

