export default {
  entry: 'src/index.js',
  dest: 'dist/revue2.js',
  moduleName: 'Revue2',
  format: 'umd',
  sourceMap: 'inline',
  external: [ 'redux' ]
};
