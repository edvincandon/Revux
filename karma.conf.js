const path = require('path')

module.exports = function (config) {
  config.set({
    target: 'node',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.vue'],
      }
    },
    webpackMiddleware: {
      noInfo: true,
      errorDetails: true
    },
    singleRun: true
  })
}
