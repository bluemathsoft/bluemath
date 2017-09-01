 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of bluemath.

 bluemath is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 bluemath is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with bluemath. If not, see <http://www.gnu.org/licenses/>.

*/

import * as THREE from 'three'
import {OrbitControls} from 'three-orbitcontrols-ts'
import {BezierSurface,BSplineSurface} from '../src/nurbs'

function makeAxes() {
  var L = 50;
  var xAxisGeometry = new THREE.Geometry();
  var yAxisGeometry = new THREE.Geometry();
  var zAxisGeometry = new THREE.Geometry();
  xAxisGeometry.vertices.push(
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(L,0,0),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(-L,0,0)
  );
  yAxisGeometry.vertices.push(
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,L,0)
  );
  zAxisGeometry.vertices.push(
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,L),
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,-L)
  );
  xAxisGeometry.computeLineDistances();
  yAxisGeometry.computeLineDistances();
  zAxisGeometry.computeLineDistances();

  return [
    new THREE.LineSegments(xAxisGeometry,
      new THREE.LineDashedMaterial({
        color: 0xffa805, dashSize: 0.3, gapSize: 0.15, linewidth: 1
      })),
    new THREE.LineSegments(yAxisGeometry,
      new THREE.LineDashedMaterial({
        color: 0xff05b4, dashSize: 0.3, gapSize: 0.15, linewidth: 1
      })),
    new THREE.LineSegments(zAxisGeometry,
      new THREE.LineDashedMaterial({
        color: 0x05ff9b, dashSize: 0.3, gapSize: 0.15, linewidth: 1
      }))
  ]
}

function makeGeometry() {

  // let bezsrf = new BezierSurface(3, 2,
  //   new NDArray([
  //       [[-1,-1,0],[0,-1,0],[1,-1,0]],
  //       [[-1,0,1],[0,0,2],[1,0,-1]],
  //       [[-1,1,0],[0,1,0],[1,1,0]],
  //       [[-1,2,0],[0,2,0],[1,2,0]]
  //     ]));
  // let {vertices,faces} = bezsrf.tessellate();


  let bsurf = new BSplineSurface(3,2,
      [0,0,0,0,1,1,1,1],
      [0,0,0,0.5,1,1,1],
      [
        [ [-1,-1,2],[0,-1,1],[1,-1,1],[2,-1,1] ],
        [ [-1,0,1],[0,0,1],[1,0,1],[2,0,1] ],
        [ [-1,1,1],[0,1,-1],[1,1,-1],[2,1,-1] ],
        [ [-1,2,0],[0,2,0],[1,2,-1],[2,2,-1] ]
      ]
  );
  let {vertices,faces} = bsurf.tessellate();

  let loader = new THREE.JSONLoader();
  return loader.parse({ vertices, faces }).geometry;

}

window.onload = () => {


  let width = 600;
  let height = 600;

  let camera = new THREE.PerspectiveCamera(75, width/height, 1, 200);

  let geometry = makeGeometry();
  var material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    shading : THREE.SmoothShading
  });
  geometry.computeVertexNormals();
  let mesh = new THREE.Mesh(geometry, material);

  let scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x111111, 150,200);

  makeAxes().forEach(function (o) { scene.add(o); });

  scene.add(mesh);

  //cpointSprite = THREE.ImageUtils.loadTexture( "static/cpoint.png" );

  let ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  let toplight = new THREE.PointLight( 0xFFFFFF );
  toplight.position.set( 0, 10, 0 );
  scene.add( toplight );
  let botlight = new THREE.PointLight( 0x555555 );
  botlight.position.set( 0, -10, 0 );
  scene.add( botlight );


  let renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(width, height);
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setClearColor(0x323234, 1);
  //renderer.setFaceCulling("back", "ccw");
  document.body.appendChild(renderer.domElement);

  camera.position.x = 4;
  camera.position.y = 4;
  camera.position.z = 4;

  var orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;
  orbitControls.dampingFactor = 0.25;
  orbitControls.enableZoom = true;
  orbitControls.autoRotate = true;
  orbitControls.autoRotateSpeed = 0.35;


  var render = function () {

    orbitControls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  };

  render();
}