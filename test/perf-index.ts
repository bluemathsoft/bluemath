/*

Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as bluemath from '../src'
const bm = bluemath;

(<any>window).bluemath = bluemath;

let LINE_SLOPE = 1;
let Y_INTERCEPT = 5;
let NOISE_WEIGHT = 0.3;

function generateData() {
  let m = LINE_SLOPE;
  let c = Y_INTERCEPT;
  let points = [];

  let xmin = -5;
  let xmax = 5;
  let nsamples = 100000;
  let step = (xmax-xmin)/nsamples;

  for(let x=xmin; x<=xmax; x+=step) {
    let y = m*x+c;
    points.push([
      x+Math.random()*NOISE_WEIGHT,
      y+Math.random()*NOISE_WEIGHT
    ]);
  }
  return points;
}

window.onload = () => {
  let POINTS_DATA = new bm.NDArray(generateData());
  let npoints = POINTS_DATA.shape[0];
  let Y = POINTS_DATA.slice(':',1);
  Y.reshape([npoints]);
  let X = POINTS_DATA.slice(':',0);
  let A = new bm.NDArray({shape:[npoints,2]});
  A.fill(1);
  for(let i=0; i<npoints; i++) {
    A.set(i,0,POINTS_DATA.get(i,0));
  }

  setTimeout(() => {

    let t0 = new Date();
    let {x} = bm.linalg.lstsq(A,Y);
    let t1 = new Date();

    let report = [];
    report.push('t[lstsq] = '+(t1-t0)+' msec');
    report.push('Computed values: m='+x.get(0,0)+' c='+x.get(1,0));
    report.push('Expected values: m='+LINE_SLOPE+' c='+Y_INTERCEPT);
    report.push('Noise weight: ',NOISE_WEIGHT);
    document.body.innerHTML = report.join('<br/>');

  }, 1000);
};
