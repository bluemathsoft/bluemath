# bluemath

[![NPM package](https://img.shields.io/npm/v/bluemath.svg)](https://www.npmjs.com/package/bluemath)

BlueMath is Math kernel library purely written in Javascript. *Work in progress*

It has several sub-modules which can be used on their own

## Modules


* @bluemath/common

Common components used by other modules of BlueMath. e.g. NDArray

[![License](https://img.shields.io/badge/License-APL2.0-blue.svg)](https://choosealicense.com/licenses/apache-2.0/)
[![NPM package](https://img.shields.io/npm/v/@bluemath/common.svg)](https://www.npmjs.com/package/@bluemath/common)

[Learn more](https://github.com/bluemathsoft/bm-common)

* @bluemath/linalg

Built on top of emscriptened LAPACK library. Provides low level access to LAPACK and high level Linear Algebra API

[![License](https://img.shields.io/badge/License-APL2.0-blue.svg)](https://choosealicense.com/licenses/apache-2.0/)
[![NPM package](https://img.shields.io/npm/v/@bluemath/linalg.svg)](https://www.npmjs.com/package/@bluemath/linalg)

[Learn more](https://github.com/bluemathsoft/bm-linalg)


* @bluemath/geom

Implements NURBS geometry for the use in CAD Applications

[![License](https://img.shields.io/badge/License-AGPLv3-orange.svg)](https://choosealicense.com/licenses/agpl-3.0/)
[![NPM package](https://img.shields.io/npm/v/@bluemath/geom.svg)](https://www.npmjs.com/package/@bluemath/geom)

[Learn more](https://github.com/bluemathsoft/bm-geom)


* @bluemath/topo

Implements Topology concepts (Winged edge data structure, Euler Operators) for use in CAD Applications

[![License](https://img.shields.io/badge/License-AGPLv3-orange.svg)](https://choosealicense.com/licenses/agpl-3.0/)
[![NPM package](https://img.shields.io/npm/v/@bluemath/topo.svg)](https://www.npmjs.com/package/@bluemath/topo)

[Learn more](https://github.com/bluemathsoft/bm-topo)


Usage
===

    npm install bluemath

Usage in TypeScript or ES6 modules javascript code
  
```typescript
import * as bluemath from 'bluemath'
console.log(bluemath.eye(3));
``` 

Usage in Common JS environment (eg. node.js, browserify)

```javascript
const bluemath = require('bluemath');
console.log(bluemath.eye(3));
```

[**API Reference**](http://www.bluemathsoftware.com/docs/index.html)

[**Unit Tests**](http://www.bluemathsoftware.com/tests/index.html)

[**Interactive Shell**](http://www.bluemathsoftware.com/shell/index.html)
