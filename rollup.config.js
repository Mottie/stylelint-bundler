import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
// import closure from 'rollup-plugin-closure-compiler-js';

export default {
  entry: 'index.js',
  dest: 'stylelint-bundle.js',
  moduleName: 'stylelint',
  format: 'iife',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false
    }),
    builtins(),
    commonjs(),
    globals(),
    // closure()
  ]
};
