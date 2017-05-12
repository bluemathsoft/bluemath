var emlapack = require('emlapack'),
  n = 5,
  dsyev = emlapack.cwrap('dsyev_', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']),
  pjobz = emlapack._malloc(1),
  puplo = emlapack._malloc(1),
  pn = emlapack._malloc(4),
  pa = emlapack._malloc(n * n * 8),
  plda = emlapack._malloc(4),
  pw = emlapack._malloc(n * 8),
  plwork = emlapack._malloc(4),
  pinfo = emlapack._malloc(4),
  pworkopt = emlapack._malloc(4);

emlapack.setValue(pjobz, 'V'.charCodeAt(0), 'i8');
emlapack.setValue(puplo, 'U'.charCodeAt(0), 'i8');
emlapack.setValue(pn, n, 'i32');
emlapack.setValue(plda, n, 'i32');
emlapack.setValue(plwork, -1, 'i32');

var a = new Float64Array(emlapack.HEAPF64.buffer, pa, n * n);
var w = new Float64Array(emlapack.HEAPF64.buffer, pw, n);
a.set([1.96, 0, 0, 0, 0, -6.49, 3.8, 0, 0, 0, -0.47, -6.39, 4.17, 0, 0, -7.2, 1.5, -1.51, 5.7, 0, -0.65, -6.34, 2.67, 1.8, -7.1]);

dsyev(pjobz, puplo, pn, pa, plda, pw, pworkopt, plwork, pinfo);
console.log(w);

var workopt = emlapack.getValue(pworkopt, 'double'),
  pwork = emlapack._malloc(workopt * 8);
emlapack.setValue(plwork, workopt, 'i32');

dsyev(pjobz, puplo, pn, pa, plda, pw, pwork, plwork, pinfo);

console.log(w);
