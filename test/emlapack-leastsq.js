
const emlapack = require('emlapack');

/*
         Source: http://www.netlib.org/lapack/explore-html/d3/d77/example___d_g_e_l_s__colmajor_8c_source.html
         Description
   11    ===========
   12
   13    In this example, we wish solve the least squares problem min_x || B - Ax ||
   14    for two right-hand sides using the LAPACK routine DGELS. For input we will
   15    use the 5-by-3 matrix
   16
   17          ( 1  1  1 )
   18          ( 2  3  4 )
   19      A = ( 3  5  2 )
   20          ( 4  2  5 )
   21          ( 5  4  3 )
   22     and the 5-by-2 matrix
   23
   24          ( -10 -3 )
   25          (  12 14 )
   26      B = (  14 12 )
   27          (  16 16 )
   28          (  18 16 )
   29     We will first store the input matrix as a static C two-dimensional array,
   30     which is stored in col-major layout, and let LAPACKE handle the work space
   31     array allocation. The LAPACK base name for this function is gels, and we
   32     will use double precision (d), so the LAPACKE function name is LAPACKE_dgels.
   33
   34     lda=5 and ldb=5. The output for each right hand side is stored in b as
   35     consecutive vectors of length 3. The correct answer for this problem is
   36     the 3-by-2 matrix
   37
   38          ( 2 1 )
   39          ( 1 1 )
   40          ( 1 2 )
   41
   42     A complete C program for this example is given below. Note that when the arrays
   43      are passed to the LAPACK routine, they must be dereferenced, since LAPACK is
   44       expecting arrays of type double *, not double **.

*/

let dgels = emlapack.cwrap('dgels_', null,
  ['number', 'number', 'number', 'number', 'number',
  'number', 'number', 'number', 'number','number','number']);

let info;
let m = 5;
let n = 3;
let nrhs = 2;
let lda = 5;
let ldb = 5;
let mn = Math.min(m, n);
let lwork = Math.max(1, mn + Math.max(mn, nrhs));

// Allocate values
let ptrans = emlapack._malloc(1); // Character pointer
let pm = emlapack._malloc(4); // Integer pointer
let pn = emlapack._malloc(4); // Integer pointer
let pnrhs = emlapack._malloc(4); // Integer pointer
let plda = emlapack._malloc(4); // Integer pointer
let pldb = emlapack._malloc(4); // Integer pointer
let pinfo = emlapack._malloc(4); // Integer pointer
let plwork = emlapack._malloc(4); // Integer pointer
let pworkopt = emlapack._malloc(4); // Integer pointer

// Set values
emlapack.setValue(ptrans, 'N'.charCodeAt(0), 'i8');
emlapack.setValue(pm, m, 'i32');
emlapack.setValue(pn, n, 'i32');
emlapack.setValue(plda, lda, 'i32');
emlapack.setValue(pldb, ldb, 'i32');
emlapack.setValue(plwork, -1, 'i32');

let pa = emlapack._malloc(lda*n*8);
let pb = emlapack._malloc(ldb*nrhs*8);

var a = new Float64Array(emlapack.HEAPF64.buffer, pa, lda * n);
var b = new Float64Array(emlapack.HEAPF64.buffer, pb, ldb * nrhs);

a.set([
  // 1,1,1,2,3,4,3,5,2,4,2,5,5,4,3
  1,2,3,4,5,1,3,5,2,4,1,4,2,5,3
]);

b.set([
  // -10,-3,12,14,14,12,16,16,18,16
  -10,12,14,16,18,-3,14,12,16,16
]);

dgels(ptrans, pm, pn, pnrhs, pa, plda, pb, pldb, pworkopt, plwork, pinfo);
info = emlapack.getValue(pinfo, 'i32');
if(info) { console.error('Exit error',info); }

let workopt = emlapack.getValue(pworkopt, 'double');
console.log(workopt);

let pwork = emlapack._malloc(4);
let work = new Float64Array(emlapack.HEAPF64.buffer, pwork, workopt);
emlapack.setValue(plwork, workopt, 'i32');

dgels(ptrans, pm, pn, pnrhs, pa, plda, pb, pldb, pwork, plwork, pinfo);
info = emlapack.getValue(pinfo, 'i32');
if(info) { console.error('Exit error',info); }

console.log(work);



