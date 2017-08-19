# Stylelint bundler [NOT WORKING]

This repo uses rollup to bundle and tree-shake [stylelint](https://github.com/stylelint/stylelint/) into a single standalone file. The resulting `stylelint-bundle.js` file is wrapped in an IIFE to make it useful in a browser extension.

**BUT** it's not working yet!

## Usage

* Download or clone this repository.
* Run `npm install` in the terminal.
* Use `npm run build` to start the rollup process.

## Problems

Some unforeseen issues have been encountered during the build process:

* The [known-css-properties](https://github.com/betit/known-css-properties) module throws this error:

    ```
    [!] Error: Unexpected token
    node_modules\known-css-properties\data\all.json (2:14)
    1: {
    2:   "properties": [
                     ^
    3:     "accelerator",
    4:     "-wap-accesskey",
    ```

  I believe the current version of `rollup-plugin-node-resolve` can't handle references to JSON files, so I [reported the problem](https://github.com/rollup/rollup-plugin-node-resolve/issues/114). In the mean time, if you modify the module's `index.js` and replace the `require()` with the contents of the `all.json` file; from this:

    ```js
    module.exports.all = require('./data/all.json').properties;
    ```

    to this:

    ```js
    module.exports.all = [
      "accelerator",
      "-wap-accesskey",
      // ...
      "zoom"
    ];
    ```

    we can work around this first problem.

* The next error is from stylelint itself, and it also is due to loading of a JSON file:

    ```
    [!] Error: Unexpected token
    node_modules\stylelint\package.json (2:9)
    1: {
    2:   "_args": [
                ^
    3:     [
    4:       "stylelint@8.0.0",
    ```

  To fix this, find the `node_modules/stylelint/lib/standalone.js` file and replace the following line:

    ```js
    const pkg = require("../package.json");
    ```

  with this (using whatever the current version of stylelint happens to be):

    ```js
    const pkg = { "version": "8.0.0" };
    ```

  now the rollup process will complete...

## Results

Sadly, the resulting file **does not work**... there are a bunch of other issues that pop up after the file has been built:

```
(!) `this` has been rewritten to `undefined`
https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
node_modules\circular-json\build\circular-json.node.js
182:   return JSON.parse(text, generateReviver(reviver));
183: }
184: this.stringify = stringifyRecursion;
     ^
185: this.parse = parseRecursion;
...and 1 other occurrence
(!) Missing exports
https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
 commonjs-proxy:stylelint-bundler\node_modules\html-tags\html-tags.json
default is not exported by node_modules\html-tags\html-tags.json
1: import * as htmlTags from "stylelint-bundler\\node_modules\\html-tags\\html-tags.json"; export default ( htmlTags && htmlTags['default'] ) || htmlTags;

                                        ^
 commonjs-proxy:stylelint-bundler\node_modules\svg-tags\lib\svg-tags.json
default is not exported by node_modules\svg-tags\lib\svg-tags.json
1: import * as svgTags from "stylelint-bundler\\node_modules\\svg-tags\\lib\\svg-tags.json"; export default ( svgTags && svgTags['default'] ) || svgTags;

                                        ^
 commonjs-proxy:stylelint-bundler\node_modules\mathml-tag-names\index.json
default is not exported by node_modules\mathml-tag-names\index.json
1: import * as index from "stylelint-bundler\\node_modules\\mathml-tag-names\\index.json"; export default ( index && index['default'] ) || index;

                                  ^
 commonjs-proxy:stylelint-bundler\node_modules\buffer-es6\index.js
default is not exported by node_modules\buffer-es6\index.js
1: import * as index from "stylelint-bundler\\node_modules\\buffer-es6\\index.js"; export default ( index && index['default'] ) || index;

                          ^
 commonjs-proxy:stylelint-bundler\node_modules\circular-json\build\circular-json.node.js
default is not exported by node_modules\circular-json\build\circular-json.node.js
1: import * as circularJson_node from "stylelint-bundler\\node_modules\\circular-json\\build\\circular-json.node.js"; export default ( circularJson_node && circularJson_node['default'] ) || circularJson_node;
```

For now, I'm using browserify (no tree shaking; `browserify -r stylelint -o stylelint-bundle.js`) to bundle the library; but the file size is 3,339 KB.

I will continue to investigate the above problems and try to get this working with rollup.

## Contributing

If you find any problems with the method I'm using to rollup stylelint, please let me know.

Open an issue, pull request or message me - gmail, username wowmotty.
