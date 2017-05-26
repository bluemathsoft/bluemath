
import {DataType} from '../basic/ndarray'
import NDArray from '../basic/ndarray'

export function eye(arg0:number|number[], datatype?:DataType) {
  let n,m;
  if(Array.isArray(arg0)) {
    n = arg0[0];
    if(arg0.length > 1) {
      m = arg0[1];
    } else {
      m = n;
    }
  } else {
    n = m = arg0;
  }
  let A = new NDArray({shape:[n,m],datatype:datatype,fill:0});
  let ndiag = Math.min(n,m);
  for(let i=0; i<ndiag; i++) {
    A.set(i,i,1);
  }
  return A;
}