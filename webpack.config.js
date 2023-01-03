/* eslint-disable */
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const _ = require('underscore');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
	const isProduction = !!(process.env.MODE == 'production');
	const config = {
		mode: process.env.MODE || 'production',
		context: __dirname,

		devtool: isProduction ? undefined : 'source-map',

		entry: { 
			app: path.join(__dirname, 'src/public/js', 'index.tsx')
		},

		output: {
			compareBeforeEmit: false,
			path: path.resolve(__dirname, './dist/public'),
			filename: 'js/[name].js',
			chunkFilename: '[chunkhash].[ext].map',
			sourceMapFilename: '[file].map',
		},

		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.html'],
			alias: {

			}
		},
	
		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/main.css'
			}),
			new LiveReloadPlugin({
				appendScriptTag: !isProduction,
				hostname: 'localhost',
				protocol: 'http'
			}),
			// new CopyWebpackPlugin({
			// 	patterns: [ {
			// 		from: 'src/public/assets/**/*',
			// 		to: 'assets'
			// 	 }]
			// })
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
			},

			minimize: isProduction,
			minimizer: [
				new CssMinimizerPlugin(),
				new TerserPlugin()
			]
		},
	
		module: {
			rules: [
				/* 
					SVG
				*/
				{
					test: /\.svg$/,
					exclude: /node_modules/,
					loader: 'svg-react-loader'
				},

				/* 
					Asset loader
				*/
				{
					test: /\.(woff2?|eot|gif|png|jpe?g)$/,
					loader: 'file-loader',
					options: {
						outputPath: 'assets/',
						name(resourcePath, resourceQuery) {		
							const newPathBreakdown = path.dirname(resourcePath).split(path.sep)
							console.log('\n]n[!!!!!!!!]',newPathBreakdown,'\n\n', path.sep)
							const prefixPath = _.rest(newPathBreakdown, _.indexOf(newPathBreakdown, 'assets') + 1).join(path.sep)
							return `${prefixPath}/[name].[ext]`;
						}
					}
				},

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
								publicPath: '/'
							}
						},
						{ 
							loader: "css-modules-typescript-loader", 
							options: {
								mode: 'emit'
							}
						},
						{ 
							loader: 'css-loader',
							options: {
								sourceMap: true,
								importLoaders: 2,
								esModule: false,
								modules: 'global',
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
				},
				
			]
		}
	}
	return config;
}