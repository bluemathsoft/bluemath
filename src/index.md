
linalg
===

This module supports linear algebra operations on vectors (1d) and matrices (2d) that are represented by n-dimensional array class [[NDArray]]

```javascript
const {linalg} = require('bluemath');
console.log(linalg.zeros(3).toString());
```

Basic operations
---
```javascript
const {basic,linalg} = require('bluemath');
let {NDArray} = basic;

let A = new NDArray([1,1,1]);
let B = new NDArray([[1],[1],[1]]);

console.log(linalg.outer(A,B).toArray());
// [
//  [1,1,1],
//  [1,1,1],
//  [1,1,1]
// ]
```
Ref: [[outer]]

Solving Equations
---
```javascript
import {linalg, basic} from 'bluemath'
let A = new basic.NDArray([
	[11,-3,0],
	[-3,6,-1],
	[0,-1,3]
]);
let B = new basic.NDArray([30,5,-25]);
linalg.solve(A,B);
console.log(B.toArray()); // [3,1,-8]
```
Ref: [[solve]]

SVD
---
```javascript
let A = new NDArray([
  [-3,6,-1],
  [11,-3,0],
  [0,-1,3]
]);
let [U,S,VT] = linalg.svd(A,true,true);
console.log(U,S,VT);
```
Ref: [[svd]]
