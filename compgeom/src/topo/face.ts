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

import {Loop} from './loop'
import {Body} from './body'
import {Vertex} from './vertex'
import {HalfEdge} from './halfedge'
import {IDManager} from './idman'

export class Face {

  oloop? : Loop;
  iloops : Loop[];
  body : Body;
  surface : any;
  id : string;

  constructor(body:Body) {
    this.body = body;
    this.iloops = [];
    this.id = 'F'+IDManager.genId('F');
  }

  addLoop(loop:Loop) {
    this.iloops.push(loop);
  }

  unlink() {

  }


  findHalfEdge(vtxFrom:Vertex, vtxTo?:Vertex) : HalfEdge|undefined {
    for(let i=0; i<this.iloops.length; i++) {
      let loop = this.iloops[i];
      let he = loop.halfedge;
      console.assert(he);
      do {
        if(he!.vertex === vtxFrom) {
          if(vtxTo) {
            console.assert(he!.next);
            if(he!.next!.vertex === vtxTo) {
              return he;
            }
          } else {
            return he;
          }
        }
        he = he!.next;
      } while(he !== loop.halfedge);
    }
    return undefined;
  }
}