const path = require('path')

module.exports = function (config) {
  config.set({
    target: 'node',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: ['test/index.js', 'src/**/*.js'],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'test/index.js': ['webpack'],
      'src/**/*.js': ['webpack', 'coverage']
    },
    coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' }
      ]
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
