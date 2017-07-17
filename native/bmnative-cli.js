
const Module = require('./build-em/bmnative');

let ndarr = new Module.NDArrayInt32([5,6,7],3);
ndarr.set([0,0,0],3,276);
ndarr.set([0,1,2],3,-45);
console.log(ndarr.get([0,0,0],3));
console.log(ndarr.get([0,1,2],3));
