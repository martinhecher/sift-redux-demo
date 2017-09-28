'use strict';

var webpack = require('webpack'),
    path = require('path');

// var siftRootPath = path.resolve('../');

module.exports = {
    cache: true,
    devtool: 'source-map',
    entry: {
        controller: ['babel-polyfill', './src/scripts/controller.js'],
        view: ['babel-polyfill', './src/scripts/view.js'],
    },
    output: {
        filename: '[name].umd-es2015.min.js',
        path: path.join(__dirname, 'public', 'dist', 'js'),
    },
    resolve: {
        // modules: ['node_modules'],
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
                }
            },
        ],
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    }
};