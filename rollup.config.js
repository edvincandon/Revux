export default {
  entry: 'src/index.js',
  dest: 'dist/vuedux.js',
  moduleName: 'Vuedux',
  format: 'umd',
  sourceMap: 'inline',
  external: [ 'redux' ]
};
