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


export class Triangulation {

  private points : number[];
  private triangles : number[];
  private edges : number[][];
  private vertices : number[][];

  constructor(
    points : number[],
    triangles? : number[],
    edges? : number[][],
    vertices? : number[][]
  )
  {
    this.points = points.slice();
    if(triangles && edges && vertices) {
      this.triangles = triangles;
      this.edges = edges;
      this.vertices = vertices;
    } else {
      // Initialize triangulation by creating a bounding triangle that
      // is big enough to enclose all points
      this.createBoundingTriangle();
    }
  }

  private createBoundingTriangle() {
    console.assert(false); // TODO
  }

  static fromPSLG(points:number[]) {
    return new Triangulation(points);
  }

  static fromTriangulation(
    points:number[],
    triangles:number[],
    edges : number[][],
    vertices : number[][]
  ) {
    return new Triangulation(points,triangles,edges,vertices);
  }

  isEdgeIllegal(edgeIdx:number) {

  }

  runDelaunay() {

  }

  toSVG(width=600,height=600) {
    const VTX_RADIUS = 3;
    const VTX_STYLE = 'fill:#f88';
    const TRI_STYLE = 'fill:#806;stroke:none';
    let vtxmarkup = `<g>`;
    for(let i=0; i<this.points.length; i+=2) {
      let x = this.points[i];
      let y = this.points[i+1];
      vtxmarkup += `<circle cx=${x} cy=${height-y} `+
        `r=${VTX_RADIUS} style="${VTX_STYLE}"></circle>\n`;
    }
    vtxmarkup += `</g>`;
    let trimarkup = `<g>`;
    for(let i=0; i<this.triangles.length; i+=3) {
      let ti0 = this.triangles[i];
      let ti1 = this.triangles[i+1];
      let ti2 = this.triangles[i+2];
      let x0 = this.points[2*ti0];
      let y0 = height-this.points[2*ti0+1];
      let x1 = this.points[2*ti1];
      let y1 = height-this.points[2*ti1+1];
      let x2 = this.points[2*ti2];
      let y2 = height-this.points[2*ti2+1];
      trimarkup += `<polyline`+
        ` points="${x0},${y0} ${x1},${y1} ${x2},${y2} ${x0},${y0}"`+
        ` style="${TRI_STYLE}"`+
        `></polyline>`;
    }
    trimarkup += `</g>`;
    return `<svg width=${width} height=${height}>\n`+
      vtxmarkup+'\n'+
      trimarkup+'\n'+
    `</svg>`;
  }
}

