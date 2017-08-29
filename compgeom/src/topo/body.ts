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

import {NDArray} from '@bluemath/common'

import {Vertex} from './vertex'
import {Edge} from './edge'
import {HalfEdge} from './halfedge'
import {Face} from './face'
import {IDManager} from './idman'

export class Body {

  vertices : Vertex[];
  halfedges : HalfEdge[];
  edges : Edge[];
  faces : Face[];
  id : string;

  constructor() {
    this.vertices = [];
    this.halfedges = [];
    this.edges = [];
    this.faces = [];
    this.id = 'B'+IDManager.genId('B');
  }

  newFace() : Face{
    let face = new Face(this);
    this.faces.push(face);
    return face;
  }

  newVertex(coord?:NDArray) : Vertex {
    let vertex = new Vertex(coord);
    this.vertices.push(vertex);
    return vertex;
  }

  newHalfEdge() : HalfEdge {
    let he = new HalfEdge();
    this.halfedges.push(he);
    return he;
  }

  newEdge() : Edge {
    let e = new Edge();
    this.edges.push(e);
    return e;
  }

  removeEdge(edge:Edge) {
    let idx = this.edges.indexOf(edge);
    console.assert(idx >= 0);
    this.edges.splice(idx,1);
  }

  removeVertex(vertex:Vertex) {
    let idx = this.vertices.indexOf(vertex);
    console.assert(idx >= 0);
    this.vertices.splice(idx,1);
  }

  removeHalfEdge(halfEdge:HalfEdge) {
    let idx = this.halfedges.indexOf(halfEdge);
    console.assert(idx >= 0);
    this.halfedges.splice(idx,1);
  }

  unlink() {
    this.faces.forEach(f => f.unlink());
    this.vertices.forEach(v => v.unlink());
    this.edges.forEach(e => e.unlink());
    this.halfedges.forEach(he => he.unlink());

    this.faces.splice(0);
    this.vertices.splice(0);
    this.edges.splice(0);
    this.halfedges.splice(0);
  }

  toDOT() {
    let s = '';
    s += 'digraph Body {\n';
    s += '  ranksep=.5;ratio=compress;\n';
    s += '  {\n';
    s += '    node[shape=plaintext];\n';
    s += '    Faces->Loops->Vertices->Edges->HalfEdges;\n';
    s += '  }\n';

    s += '  {\n';
    s += '    rank=same; Vertices;';
    for(let vertex of this.vertices) {
      s += vertex.id+';';
    }
    s += '  }\n';

    s += '  {\n';
    s += '    rank=same; Edges;';
    for(let edge of this.edges) {
      s += edge.id+';';
    }
    s += '  }\n';

    s += '  {\n';
    s += '    rank=same; Faces;';
    for(let face of this.faces) {
      s += face.id+';';
    }
    s += '\n';
    s += '  }\n';

    s += '}';
    return s;
  }
}