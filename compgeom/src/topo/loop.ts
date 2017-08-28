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

import {HalfEdge} from './halfedge'
import {Face} from './face'

export class Loop {

  face : Face;
  halfedge? : HalfEdge;

  constructor(face:Face) {
    this.face = face;
  }

  insertHalfEdgeAfter(heNew:HalfEdge, heExisting:HalfEdge) {
    let next = heExisting.next;
    heExisting.next = heNew;
    heNew.prev = heExisting;
    heNew.next = next;
    next!.prev = heNew;
  }

}