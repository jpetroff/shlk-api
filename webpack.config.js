/* eslint-disable */
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = (env, argv) => {
	const isProduction = !!(argv.mode == 'production');
	const config = {
		context: __dirname,

		devtool: isProduction ? undefined : 'source-map',

		entry: { app: path.join(__dirname, 'src/public/js', 'index.tsx') },

		output: {
			compareBeforeEmit: false,
			path: path.resolve(__dirname, './dist/public'),
			filename: 'js/[name].js',
			chunkFilename: '[chunkhash].[ext].map',
			sourceMapFilename: '[file].map',
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.html']
		},
	
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/main.css'
			}),
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
						{ loader: "css-modules-typescript-loader"},
						{ 
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 1,
								esModule: true,
								modules: 'global'
							},
						},
						{
							loader: 'less-loader',
							options: {
								sourceMap: true,
								lessOptions: {
									paths: ['.'],
									rewriteUrls: 'all',
									rootpath: '/'
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