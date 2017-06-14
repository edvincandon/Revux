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
              plugins: [
                "check-es2015-constants",
                "transform-es2015-block-scoped-functions",
                "transform-es2015-block-scoping",
                "transform-es2015-arrow-functions",
                "transform-es2015-classes",
                "transform-es2015-computed-properties",
                "transform-es2015-destructuring",
                "transform-es2015-duplicate-keys",
                "transform-es2015-for-of",
                "transform-es2015-function-name",
                "transform-es2015-literals",
                "transform-es2015-modules-commonjs",
                "transform-es2015-object-super",
                "transform-es2015-parameters",
                "transform-es2015-shorthand-properties",
                "transform-es2015-spread",
                "transform-es2015-sticky-regex",
                "transform-es2015-template-literals",
                "transform-es2015-unicode-regex",
                "transform-regenerator"
              ]
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
