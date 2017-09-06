let webpack = require("webpack");
let ShellPlugin = require("webpack-shell-plugin");

let uglifyMinify = new webpack.optimize.UglifyJsPlugin({
  compress: {
      warnings: false
  },
  sourceMap: true
});

let shellPlugin = new ShellPlugin({
  onBuildEnd: ['node pack.js']
});

module.exports = {
    entry: './src/index.ts',
    output: {
      filename: './build/code.js'
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
    },
    module: {
      loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
        // all files with a `.ts` or `.tsx` extension will be handled by `awesome-typescript-loader`
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader?sourceMap=true' }
      ]
    },
    plugins: [
      // uglifyMinify,
      shellPlugin
    ],
     // Enable sourcemaps for debugging webpack's output.
     devtool: "source-map"
  }
