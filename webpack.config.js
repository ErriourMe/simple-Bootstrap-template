const path = require('path');
const fs = require("fs");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/pages');

module.exports = {
  entry: {
    main: './src/js/index.js',
    vendor: './src/js/vendor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "css/[name].css"
            }
          },
          {
            loader: "extract-loader"
          },
          {
            loader: "css-loader?-url"
          },
          {
            loader: "postcss-loader",
            options: {
                options: {},
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      //img loader
      {
        test: /\.(svg|png|jpe?g|)$/i,
        use: {
          loader: "file-loader",
          options: {
            name: 'images/[name].[ext]',
          },
        },
      },
      {
        test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'webfonts/[name].[ext]',
        },
        }]
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/layouts'),
        use: ['raw-loader']
      },
      {
      test: /\.html$/,
      include: path.resolve(__dirname, 'src/html/components'),
      use: ['raw-loader']
      },
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
        }
      })
    ]
  },
  plugins: [
    //   new webpack.ProvidePlugin({
    //     $: "jquery",
    //     jQuery: "jquery",
    //     'window.jQuery': 'jquery'
    //   }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].css"
    }),
    new CopyPlugin([
        { from: 'src/images', to: 'images' },
        { from: 'src/webfonts', to: 'fonts' },
    ], { copyUnmodified: true })
  ].concat(htmlPlugins)
};
