export default {
  entry: 'src/index.js',
  dest: 'dist/revux.js',
  moduleName: 'revux',
  format: 'umd',
  sourceMap: 'inline',
  external: [ 'redux' ]
};
