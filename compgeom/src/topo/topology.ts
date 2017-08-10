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

import {NDArray,div,arr,length} from '@bluemath/common'
import {Vertex} from './vertex'
import {Face} from './face'
import {HalfEdge} from './halfedge'

interface Trapezoid {
  top : HalfEdge;
  bottom : HalfEdge;
  leftp : Vertex;
  rightp : Vertex;
  adjascent : Trapezoid[];
}


export class Topology {

  vertices : Vertex[];
  faces : Face[];
  halfedges : HalfEdge[];

  constructor() {
    this.vertices = [];
    this.faces = [];
    this.halfedges = [];
  }

  fromPolygon(points:NDArray) {
    if(points.shape.length !== 2 || // Not a array of points
      (points.shape[1] !== 2 && points.shape[1] !== 3) // neither 2D nor 3D
    )
    {
      throw new Error("Expecting array of 2D or 3D points");
    }
    let firstVtx:Vertex|undefined = undefined;
    let prevHE:HalfEdge|undefined = undefined;
    let firstHEForward:HalfEdge|undefined = undefined;
    let firstHEBackward:HalfEdge|undefined = undefined;
    let curVtx:Vertex;
    for(let i=0; i<points.length; i++) {
      let point = <NDArray>points.get(i);
      curVtx = new Vertex(point);
      let heForward = new HalfEdge(curVtx);
      let heBackward = new HalfEdge(curVtx);
      if(!firstVtx) {
        firstVtx = curVtx;
        firstHEForward = heForward;
        firstHEBackward = heBackward;
      }
      curVtx.halfedge = heForward;
      if(prevHE) {
        prevHE.next = heForward;
        prevHE.pair = heBackward;
        heBackward.pair = prevHE;
      }
      this.vertices.push(curVtx);
      this.halfedges.push(heForward);
      this.halfedges.push(heBackward);
      prevHE = heForward;
    }
    // Add last HalfEdge pair that closes the polygon face
    curVtx!.halfedge!.next = firstHEForward;
    firstHEBackward!.pair = curVtx!.halfedge;
    prevHE!.pair = firstHEBackward;

    let face = new Face(this.halfedges[0]);
    this.faces.push(face);

  }

  createNewVertex(coord:number[]) {
    let v = new Vertex(arr(coord));
    this.vertices.push(v);
  }

  findVertexAt(coord:number[]):Vertex|null {
    let icoord = arr(coord);
    for(let v of this.vertices) {
      if(v.coord.isEqual(icoord)) {
        return v;
      }
    }
    return null;
  }

  generateTrapezoidMap() {

  }

  toSVG() {
    const VERTEX_RADIUS = 10;
    const HE_ORIGIN_RADIUS = 5;
    const WIDTH = 800;
    const HEIGHT = 800;
    const HE_OFFSET_LAT = 5;
    const HE_OFFSET_LON = 20;
    const HALFEDGE_STYLE = 'stroke:#000'
    const VTX_STYLE = 'fill:#44f'
    const HE_ORIGIN_STYLE = 'fill:#f44';

    let vtxmarkup = this.vertices.map(vtx => {
      let cx = vtx.coord.get(0);
      let cy = HEIGHT-<number>vtx.coord.get(1);
      let title = vtx.coord.toString();
      return `<circle cx=${cx} cy=${cy} r=${VERTEX_RADIUS} `+
        `style="${VTX_STYLE}"><title>${title}</title></circle>`;
    }).join('\n');

    let hemarkup = this.halfedges.map(he => {
      let ocx,ocy,dcx,dcy;
      if(he.origin) {
        ocx = <number>he.origin.coord.get(0);
        ocy = HEIGHT - <number>he.origin.coord.get(1);
      } else {
        ocx = 0.2 * WIDTH;
        ocy = HEIGHT - 0.2 * HEIGHT;
      }
      if(he.pair && he.pair.origin) {
        dcx = <number>he.pair.origin.coord.get(0);
        dcy = HEIGHT - <number>he.pair.origin.coord.get(1);
      } else {
        dcx = 0.8 * WIDTH;
        dcy = HEIGHT - 0.8 * HEIGHT;
      }
      let vec = arr([dcx-ocx,dcy-ocy]);
      let veclen = length(vec);
      let dir = (<NDArray>div(vec,veclen)).data;
      let ortho = [-dir[1],dir[0]];
      ocx += ortho[0] * HE_OFFSET_LAT + dir[0] * HE_OFFSET_LON;
      ocy += ortho[1] * HE_OFFSET_LAT + dir[1] * HE_OFFSET_LON;
      dcx += ortho[0] * HE_OFFSET_LAT - dir[0] * HE_OFFSET_LON;
      dcy += ortho[1] * HE_OFFSET_LAT - dir[1] * HE_OFFSET_LON;
      return `<line x1=${ocx} y1=${ocy} x2=${dcx} y2=${dcy} `+
        `style="${HALFEDGE_STYLE}"></line>`+
        `<circle cx=${ocx} cy=${ocy} r=${HE_ORIGIN_RADIUS} `+
        `style="${HE_ORIGIN_STYLE}"></circle>`;
    }).join('\n');

    return `
    <svg width=${WIDTH} height=${HEIGHT}>
      <g id="vertices">
      ${vtxmarkup}
      </g>
      <g id="halfedges">
      ${hemarkup}
      </g>
    </svg>
    `;
  }

}