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
import {IDManager} from './idman'

export type heWalkHandler = (he:HalfEdge, count:number) => void;

export class HalfEdge {

  vertex? : Vertex;
  prev? : HalfEdge;
  next? : HalfEdge;
  edge? : Edge;
  loop? : Loop;
  id : string;

  constructor(origin?:Vertex, pair?:HalfEdge, next?:HalfEdge, loop?:Loop) {
    this.vertex = origin;
    this.prev = pair;
    this.next = next;
    this.loop = loop;
    this.id = 'HE'+IDManager.genId('HE');
  }

  mate() : HalfEdge {
    console.assert(this.edge);
    if(this.edge!.hePlus === this) {
      console.assert(this.edge!.heMinus);
      return this.edge!.heMinus!;
    } else {
      console.assert(this.edge!.hePlus);
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

  static walk(heStart:HalfEdge, callback:heWalkHandler) {
    let cursor = heStart;
    let count = 0;
    do {
      callback(cursor, count);
      console.assert(cursor.next);
      cursor = cursor.next!;
      count++;
    } while(cursor !== heStart);
  }

}