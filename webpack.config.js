#!/usr/bin/env node
"use strict";

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const vendor = [
  "babel-polyfill",
  "react",
  "react-dom",
  "redux",
  "redux-logger",
  "redux-thunk",
  "glamorous",
  "normalize.css"
];
const extensions = [".js", ".jsx", ".css", ".scss", ".json"];
let plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: ["vendor", "manifest"]
  }),
  new HtmlWebpackPlugin({
    template: "src/index.htm",
    chunksSortMode: "dependency"
  }),
  new ExtractTextPlugin({
    filename: "style.[contenthash].css",
    allChunks: true
  })
];

module.exports = (env = {}) => {
  if (env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    entry: {
      bundle: "./src/index.js",
      vendor
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].[chunkhash].js"
    },
    module: {
      rules: [
        {
          use: "babel-loader",
          test: /\.jsx?$/,
          exclude: /node_modules/
        },
        {
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ["css-loader", "sass-loader"]
          }),
          test: /\.s?css$/
        }
      ]
    },
    resolve: {
      extensions
    },
    plugins
  };
};
