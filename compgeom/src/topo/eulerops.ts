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
import {Edge} from './edge'
import {HalfEdge} from './halfedge'
import {Body} from './body'
import {Loop} from './loop'

export type MVFS_result = {
  vertex : Vertex;
  body : Body;
  face : Face;
}

export type MEV_result = {
  edge : Edge;
  vertex : Vertex;
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

  private static LMEV(he0:HalfEdge, he1:HalfEdge) {
    console.assert(he0.loop);
    let body = he0.loop!.face.body;

    let vertex = body.newVertex();
    let edge = body.newEdge();

    if(he0 === he1) {
      let he2 = body.newHalfEdge();
      he2.loop = he0.loop;
      he2.vertex = vertex;
      he0.loop!.insertHalfEdgeAfter(he2,he0);
      vertex.halfedge = he2;
      edge.hePlus = he0;
      edge.heMinus = he2;
      he0.edge = edge;
      he2.edge = edge;
    } else {
      let he2 = body.newHalfEdge();
      let he3 = body.newHalfEdge();
      he2.loop = he0.loop;
      he3.loop = he0.loop;
      he2.vertex = he0.vertex;
      he3.vertex = vertex;
      he0.loop!.insertHalfEdgeAfter(he2,he1);
      he0.loop!.insertHalfEdgeAfter(he3,he2);
      vertex.halfedge = he3;
      edge.hePlus = he3;
      edge.heMinus = he2;
      he3.edge = edge;
      he2.edge = edge;
    }
    return {vertex, edge};
  }

  static MEV(face:Face, vertex:Vertex) {
    let he0 = face.findHalfEdge(vertex);
    console.assert(he0);
    let he1 = he0!.isSolitary() ? he0 : he0!.prevInLoop();
    console.assert(he1);
    return EulerOps.LMEV(he0!, he1!);
  }
}