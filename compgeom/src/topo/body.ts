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

export class Body {

  vertices : Vertex[];
  halfedges : HalfEdge[];
  edges : Edge[];
  faces : Face[];

  constructor() {
    this.vertices = [];
    this.halfedges = [];
    this.edges = [];
    this.faces = [];
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
}