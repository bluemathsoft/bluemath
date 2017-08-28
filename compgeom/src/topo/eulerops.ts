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

import {Vertex} from './vertex'
import {Face} from './face'
import {Body} from './body'
import {Loop} from './loop'

export type MVFS_result = {
  vertex : Vertex;
  body : Body;
  face : Face;
}

export class EulerOps {

  static MVFS() : MVFS_result {
    let body = new Body();

    let vertex = body.newVertex();
    let face = body.newFace();
    let loop = new Loop(face);
    face.addLoop(loop);

    let he = body.newHalfEdge();
    he.next = he;
    he.prev = he;
    he.loop = loop;
    he.vertex = vertex;

    loop.halfedge = he;
    vertex.halfedge = he;

    return {body,vertex,face};
  }

  static KVFS(body:Body) {
    body.unlink();
  }
}