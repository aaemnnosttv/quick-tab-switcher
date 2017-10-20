var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')

var isProduction = process.env.NODE_ENV === 'production'

var bubleOptions = {
  target: isProduction ? null : { chrome: 52, firefox: 48 },
  objectAssign: 'Object.assign'
}

module.exports = {
  entry: {
    background: `${alias.src}/background.js`,
    switcher: `${alias.src}/switcher.js`
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve: {
    alias
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules|vue\/dist|vuex\/dist/,
        options: bubleOptions
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          buble: bubleOptions
        }
      },
      {
        test: /\.(png|woff2)$/,
        loader: 'url-loader?limit=0'
      }
    ]
  },
  performance: {
    hints: false
  },
  devtool: ! isProduction
    ? '#inline-source-map'
    : false
}

if (isProduction) {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new CopyWebpackPlugin([
      { from: `${alias.src}/switcher.html` }
    ]),
    new WebpackCleanupPlugin()
  ]
}
