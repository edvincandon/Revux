const path = require('path')
const webpack = require('webpack')

module.exports = function (config) {
  config.set({
    target: 'node',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'test/index.js',
      './node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js'
    ],
    reporters: ['progress', 'coverage-istanbul'],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap'],
    },
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      'report-config': {
        html: {
          subdir: 'html'
        }
      },
      fixWebpackSourcePaths: true
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015']
            }
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
          {
          test: /\.js$/,
          include: path.resolve('src/'),
          exclude: /(node_modules|\.spec\.js$)/,
          loader: 'istanbul-instrumenter-loader',
          enforce: 'post',
          options: {
            esModules: true
          }
        }],
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin({
          filename: null,
          test: /\.(js)($|\?)/i
        })
      ],
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
