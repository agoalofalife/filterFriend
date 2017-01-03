'use strict';
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
module.exports = {

    entry  : {
        build : "./developer/build"
    },
    output : {
        path : __dirname ,
        filename : 'index.js',
        library : 'index'
    },
    watch : true,
    watchOptions : {
        aggregateTimeout:100
    },
    devtool: "cheap-inline-module-source-map",

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        modulesTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    }
};