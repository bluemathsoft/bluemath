"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ndarray_1 = require("../basic/ndarray");
function eye(arg0, datatype) {
    var n, m;
    if (Array.isArray(arg0)) {
        n = arg0[0];
        if (arg0.length > 1) {
            m = arg0[1];
        }
        else {
            m = n;
        }
    }
    else {
        n = m = arg0;
    }
    var A = new ndarray_1.default({ shape: [n, m], datatype: datatype, fill: 0 });
    var ndiag = Math.min(n, m);
    for (var i = 0; i < ndiag; i++) {
        A.set(i, i, 1);
    }
    return A;
}
exports.eye = eye;
