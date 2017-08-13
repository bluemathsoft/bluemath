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

  private pointBuffer : number[];
  private triangleBuffer? : number[];

  constructor(pointBuf:number[], triangleBuf?:number[]) {
    this.pointBuffer = pointBuf.slice();
    if(triangleBuf) {
      this.triangleBuffer = triangleBuf.slice();
    } else {
      // Create initial triangulation from PSLG
    }
  }

  static fromPSLG(points:number[]) {
    return new Triangulation(points);
  }

  static fromTriangulation(points:number[], triangles:number[]) {
    return new Triangulation(points, triangles);
  }

  runDelaunay() {

  }

  toSVG(width=600,height=600) {
    const VTX_RADIUS = 3;
    const VTX_STYLE = 'fill:#f88';
    const TRI_STYLE = 'fill:none;stroke:#88f';
    let vtxmarkup = `<g>`;
    for(let i=0; i<this.pointBuffer.length; i+=2) {
      let x = this.pointBuffer[i];
      let y = this.pointBuffer[i+1];
      vtxmarkup += `<circle cx=${x} cy=${height-y} `+
        `r=${VTX_RADIUS} style="${VTX_STYLE}"></circle>\n`;
    }
    vtxmarkup += `</g>`;
    let trimarkup = `<g>`;
    for(let i=0; i<this.triangleBuffer!.length; i+=3) {
      let ti0 = this.triangleBuffer![i];
      let ti1 = this.triangleBuffer![i+1];
      let ti2 = this.triangleBuffer![i+2];
      let x0 = this.pointBuffer[2*ti0];
      let y0 = height-this.pointBuffer[2*ti0+1];
      let x1 = this.pointBuffer[2*ti1];
      let y1 = height-this.pointBuffer[2*ti1+1];
      let x2 = this.pointBuffer[2*ti2];
      let y2 = height-this.pointBuffer[2*ti2+1];
      trimarkup += `<polyline `+
        `points="${x0},${y0} ${x1},${y1} ${x2},${y2} ${x0},${y0}"`+
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

