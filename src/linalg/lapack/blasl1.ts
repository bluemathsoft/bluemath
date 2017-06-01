
import Module from 'emlapack'
let em = Module;

export function asum() {

}

export function dot() {
  var ddot = em.cwrap('f2c_ddot',
    null,
    ['number', 'number', 'number', 'number', 'number']);
  var n = 4,
    pn = em._malloc(4),
    pdx = em._malloc(n * 8),
    pincx = em._malloc(4),
    pdy = em._malloc(n * 8),
    pincy = em._malloc(4),
    dx = new Float64Array(em.HEAPF64.buffer, pdx, n),
    dy = new Float64Array(em.HEAPF64.buffer, pdy, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');
  dx.set([1, 2, 3, 4]);
  dy.set([2, 3, 4, 5]);

  return ddot(pn, pdx, pincx, pdy, pincy);
}