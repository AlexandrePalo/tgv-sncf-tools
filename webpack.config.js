const webpack = require('webpack')
const path = require('path')

let config = {
    entry: './src/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    mode: 'production',
    target: 'node'
}

module.exports = config
