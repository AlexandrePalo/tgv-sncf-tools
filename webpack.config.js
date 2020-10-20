const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: './bundle.js',
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
    },
    module: {
        rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }],
    },
    target: 'node',
    plugins: [
        // Ignore moment locales
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
}
