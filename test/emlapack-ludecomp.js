
const emlapack = require('emlapack');


let dgesv = emlapack.cwrap('dgesv_', null, [
  'number', 'number', 'number', 'number',
  'number', 'number', 'number', 'number'
]);

let n = 3;
let nrhs = 1;
let lda = n; // TODO
let ldb = 3;

let pn = emlapack._malloc(4);
let plda = emlapack._malloc(4);
let pldb = emlapack._malloc(4);
let pnrhs = emlapack._malloc(4);
let pa = emlapack._malloc(4);
let pb = emlapack._malloc(4);
let pipiv = emlapack._malloc(4);
let pinfo = emlapack._malloc(4);

let a = new Float64Array(emlapack.HEAPF64.buffer, pa, lda*n);
let b = new Float64Array(emlapack.HEAPF64.buffer, pb, ldb*nrhs);
let ipiv = new Float64Array(emlapack.HEAPF64.buffer, pipiv, n);

a.set([
  1,2,3, 4,5,6, 7,8,10
  // 1,2,3, 2,4,5, 3,7,3
  // 3,6,5,7
]);
b.set([
  10,20,30
  // 9,39
]);
emlapack.setValue(pn, n, 'i32');
emlapack.setValue(plda, lda, 'i32');
emlapack.setValue(pldb, ldb, 'i32');
emlapack.setValue(pnrhs, nrhs, 'i32');

dgesv(pn, pnrhs, pa, plda, pipiv, pb, pldb, pinfo);
info = emlapack.getValue(pinfo, 'i32');
if(info) { console.error('Exit error',info); }

console.log(a);
console.log(b);
console.log(ipiv);