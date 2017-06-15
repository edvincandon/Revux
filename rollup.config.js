import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'dist/revux.js',
  moduleName: 'revux',
  format: 'umd',
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  external: [ 'redux' ]
};
