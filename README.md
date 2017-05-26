
## bluemath

Math kernel in Javascript (Work in Progress)

[![NPM package](https://img.shields.io/npm/v/bluemath.svg)](https://www.npmjs.com/package/bluemath)
[![License](https://img.shields.io/badge/license-AGPL3-blue.svg)](LICENSE)

Usage
===

    npm install bluemath

Use in TypeScript or ES6 modules javascript code

    import {linalg} from bluemath
    console.log(linalg.eye(3));

Use in Common JS environment (eg. node.js, browserify)

    let linalg = require('bluemath').linalg
    console.log(linalg.eye(3));

Development
===

    git clone git@github.com:bluemathsoft/bluemath.git
    cd bluemath
    npm install

    # Build unit tests
    npm run build

    # Run tests by opening test/index.html in browser

    # For automatic rebuilds during development
    npm run watch
