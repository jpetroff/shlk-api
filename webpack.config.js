/* eslint-disable */
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NoEmitPlugin = require("no-emit-webpack-plugin");

const generateLessImportsFile = () => {
	const entryDir = path.join(__dirname, 'src/public/css');
	const normalize = path.join(__dirname, 'src/public/css/normalize.css');
	const mainDirList = glob.sync(path.join(__dirname, 'src/public/css/*.less'));
	const componentsList = glob.sync(path.join(__dirname, 'src/public/components/**/*.less'));
	var writeLessImports = '';

	writeLessImports += `@import (inline) '${path.relative(entryDir, normalize)}'; \n`;
	writeLessImports += `\n\n// ***** main directory imports *****\n\n`;
	mainDirList.forEach(
		(filename) => {
			if(filename.includes('styles.less')) return;
			writeLessImports += `@import '${path.relative(entryDir, filename)}'; \n`;
		}
	);
	writeLessImports += `\n\n// ***** component imports *****\n\n`;
	componentsList.forEach(
		(filename) => {
			writeLessImports += `@import '${path.relative(entryDir, filename)}'; \n`;
		}
	);

	const importsFile = path.join(entryDir, 'styles.less');
	fs.writeFileSync( importsFile, writeLessImports );

	return importsFile; 
}

module.exports = {
	context: __dirname,
	mode: 'production',
	entry: {
		app: path.join(__dirname, 'src/public/js', 'main.tsx'),
		pages: path.join(__dirname, 'src/public', 'index.html'),
		styles: generateLessImportsFile()
	},
  output: {
		compareBeforeEmit: false,
    path: path.resolve(__dirname, './dist/public'),
    filename: 'js/[name].js',
		assetModuleFilename: '[file]'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/styles.css'
		}),
		new NoEmitPlugin(['styles.js', 'pages.js'])
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
						// {
						// 	loader: 'babel-loader',
						// 	options: babelOpts
						// },
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
				type: 'asset/resource',
				generator: {
					emit: false,
				},
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../assets',
						}
					},
					{ 
						loader: 'css-loader',
						options: {
              sourceMap: true,
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