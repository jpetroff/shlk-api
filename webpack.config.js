/* eslint-disable */
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NoEmitPlugin = require("no-emit-webpack-plugin");
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = (env, argv) => {
	const isProduction = !!(argv.mode == 'production');
	const config = {
		context: __dirname,
		devtool: isProduction ? undefined : 'eval-source-map',
		entry: {
			app: path.join(__dirname, 'src/public/js', 'main.tsx'),
			pages: path.join(__dirname, 'src/public', 'index.html'),
			styles: path.join(__dirname, 'src/public/css', 'main.less')
		},
		output: {
			compareBeforeEmit: false,
			path: path.resolve(__dirname, './dist/public'),
			filename: 'js/[name].js',
			chunkFilename: '[chunkhash].[ext].map',
			sourceMapFilename: '[file].map',
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx']
		},
	
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/styles.css'
			}),
			new NoEmitPlugin(['styles.js', 'pages.js']),
			new LiveReloadPlugin({
				appendScriptTag: !isProduction
			})
		], 
	
		optimization: {
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'libs',
						chunks: 'all',
					},
				},
			}
		},
	
		module: {
			rules: [
				/* 
					TS
				 */
					{
						test: /\.ts(x?)$/,
						exclude: /node_modules/,
						use: [
							{
								loader: 'ts-loader',
								options: {
									configFile: 'tsconfig.frontend.json'
								}
							}
						]
					},
	
				/* 
				LESS
				*/
				{
					test: /\.(le|c)ss$/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								publicPath: '../assets'
							}
						},
						{ 
							loader: 'css-loader',
							options: {
							},
						},
						{
							loader: 'less-loader',
							options: {
								lessOptions: {
									paths: ['.'],
									rewriteUrls: 'all',
									rootpath: '/',
									sourceMap: { outputSourceFiles: true }
								}
							}
						}
					]
				},
	
				/* 
				HTML
				*/
				{
					test: /\.html$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: "[name].[ext]",
							}
						},
						{
							loader: 'extract-loader',
							options: {
								publicPath: path.join(__dirname, 'dist/public')
							}
						},
						{
								loader: "html-loader",
								options: {
									sources: false,
								}
						}
					]
				}
	
			]
		}
	}
	return config;
}