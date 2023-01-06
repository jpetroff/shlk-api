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

const sourceDir = 'src/public';
const outputDir = 'dist/public';

module.exports = (env, argv) => {
	const isProduction = !!(process.env.MODE == 'production');
	const config = {
		mode: process.env.MODE || 'production',
		context: __dirname,

		devtool: isProduction ? undefined : 'source-map',

		entry: { 
			app: path.join(__dirname, sourceDir, 'js', 'index.tsx')
		},

		output: {
			compareBeforeEmit: false,
			path: path.join(__dirname, outputDir),
			filename: 'js/[name].js',
			chunkFilename: '[chunkhash].[ext].map',
			sourceMapFilename: '[file].map',
		},

		resolve: {
			roots: [path.join(__dirname, sourceDir)],
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
					exclude: /(node_modules|favicon)/,
					loader: 'svg-react-loader',
				},

				/* 
					Asset loader
				*/
				{
					test: /\.(woff2?|eot|gif|png|jpe?g|webmanifest|xml|svg|ico)$/,
					loader: 'file-loader',
					exclude: /assets\/svg/,
					options: {
						esModule: false,
						name(resourcePath, resourceQuery) {		
							const newPathBreakdown = path.dirname(resourcePath).split(path.sep)
							// console.log('\n]n[!!!!!!!!]',newPathBreakdown,'\n\n', path.sep)
							const prefixPath = _.rest(newPathBreakdown, _.indexOf(newPathBreakdown, path.basename(outputDir)) + 1).join(path.sep)
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
								esModule: false,
								name: "[name].[ext]",
							}
						},
						{
							loader: 'extract-loader',
							options: {
								esModule: false,
								publicPath: path.join(__dirname, outputDir)
							}
						},
						{
								loader: "html-loader",
								options: {
									esModule: false,
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