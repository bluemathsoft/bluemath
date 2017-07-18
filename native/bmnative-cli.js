
const Module = require('./build-em/bmnative');

let ndarrI = new Module.NDArrayInt32([5,6,7],3);
ndarrI.set([0,0,0],3,276);
ndarrI.set([0,1,2],3,-45);
console.log(ndarrI.get([0,0,0],3));
console.log(ndarrI.get([0,1,2],3));


let ndarrF = new Module.NDArrayFloat32([2,2,2],3);
ndarrF.set([0,0,0],3, 45.66);
console.log(ndarrF.get([0,0,0],3));


