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
import {Loop} from './loop'
import {Edge} from './edge'

export class HalfEdge {

  vertex? : Vertex;
  prev? : HalfEdge;
  next? : HalfEdge;
  edge? : Edge;
  loop? : Loop;

  constructor(origin?:Vertex, pair?:HalfEdge, next?:HalfEdge, loop?:Loop) {
    this.vertex = origin;
    this.prev = pair;
    this.next = next;
    this.loop = loop;
  }

  mate() : HalfEdge {
    console.assert(this.edge);
    if(this.edge!.hePlus === this) {
      return this.edge!.heMinus!;
    } else {
      return this.edge!.hePlus!;
    }
  }

  unlink() {

  }

  isSolitary() {
    return !this.edge;
  }

  prevInLoop() {
    let cursor = this.next;
    console.assert(cursor);
    while(cursor!.next !== this) {
      cursor = cursor!.next;
    }
    return cursor;
  }

}