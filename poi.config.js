const path = require('path')

module.exports = {
  presets: [
    require('poi-preset-karma')({
      port: 5001,
      files: ['test/*.spec.js']
    })
  ],
  extendWebpack(config) {
    config.module.rule('istanbul-instrumenter-loader')
          .exclude
            .add(/(node_modules|test|\.test\.jsx?)/)
            .end()
    return config
  },
  karma: {
    target: 'node',
    browsers: ['PhantomJS']
  }
}
