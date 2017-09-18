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
import {NDArray} from '@bluemath/common'

export type MVFS_result = {
  vertex : Vertex;
  body : Body;
  face : Face;
}

export type MEV_result = {
  edge : Edge;
  vertex : Vertex;
}

export type MEF_result = {
  edge : Edge;
  face : Face;
}

export class EulerOps {

  /**
   * Make Vertex Face Solid
   * (Solid = Body in this library)
   */
  static MVFS(coord:NDArray) : MVFS_result {
    let body = new Body();

    let vertex = body.newVertex(coord);
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

  /**
   * Kill Vertex Face Solid
   * (Solid = Body in this library)
   */
  static KVFS(body:Body) {
    body.unlink();
  }

  /**
   * Low level MEV (Make Edge Vertex)
   */
  private static LMEV(he0:HalfEdge, he1:HalfEdge, coord:NDArray) {
    console.assert(he0.loop);
    let body = he0.loop!.face.body;

    let vertex = body.newVertex(coord);
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

  /**
   * Make Edge Vertex
   */
  static MEV(face:Face, vertex:Vertex, coord:NDArray) {
    let he0 = face.findHalfEdge(vertex);
    console.assert(he0);
    let he1 = he0!.isSolitary() ? he0 : he0!.prevInLoop();
    console.assert(he1);
    return EulerOps.LMEV(he0!, he1!, coord);
  }

  /**
   * Kill Edge Vertex
   */
  static KEV(edge:Edge, vertex:Vertex) {
    console.assert(edge.hePlus);
    let loop = edge.hePlus!.loop;
    console.assert(loop);
    let face = loop!.face;
    console.assert(face);
    let body = face!.body;
    console.assert(edge.hePlus);
    console.assert(edge.heMinus);

    if(edge.hePlus!.next === edge.heMinus) {
      // KEV should remove only the MINUS halfedge
      // The PLUS halfedge will remain behind as solitary

      // - Remove MINUS halfedge
      let heToRemove = edge.heMinus!;
      let heToSurvive = edge.hePlus!;
      heToRemove.next = undefined; // TODO - can this be done in unlink of HE?
      heToRemove.prev = undefined;
      heToRemove.edge = undefined;
      heToRemove.loop = undefined;
      heToRemove.vertex = undefined;

      // - Make PLUS solitary halfedge
      edge.hePlus!.next = edge.hePlus;
      edge.hePlus!.prev = edge.hePlus;
      edge.hePlus!.edge = undefined;

      if(loop!.halfedge === heToRemove) {
        loop!.halfedge = heToSurvive;
      }

      edge.unlink();
      body.removeEdge(edge);

      vertex.unlink();
      body.removeVertex(vertex);

      body.removeHalfEdge(heToRemove);
    } else {
      // KEV should remove both of its halfedges
      if(loop!.halfedge === edge.hePlus) {
        loop!.halfedge = edge.hePlus!.next;
      }
      loop!.removeHalfEdge(edge.hePlus!);
      if(loop!.halfedge === edge.heMinus) {
        loop!.halfedge = edge.heMinus!.next;
      }
      loop!.removeHalfEdge(edge.heMinus!);

      edge.hePlus!.unlink();
      edge.heMinus!.unlink();

      body.removeHalfEdge(edge.heMinus!);
      body.removeHalfEdge(edge.hePlus!);

      edge.unlink();
      vertex.unlink();

      body.removeEdge(edge);
      body.removeVertex(vertex);
    }
  }

  /**
   * Make Edge Face
   */
  static MEF(face:Face,
    fromHEV0:Vertex, fromHEV1:Vertex|undefined,
    toHEV0:Vertex, toHEV1:Vertex|undefined) : MEF_result
  {
    let heFrom = face.findHalfEdge(fromHEV0, fromHEV1);
    let heTo = face.findHalfEdge(toHEV0, toHEV1);

    console.assert(heFrom);
    console.assert(heTo);

    let vFrom = fromHEV0;
    let vTo = toHEV0;

    let body = face.body;

    // heFrom and heTo are halfedges emanating from the vertices between which
    // we want to place the new edge. These vertices will be vFrom, vTo resp.

    let newEdge = body.newEdge();
    let newFace = body.newFace();
    let newLoop = new Loop(newFace);
    newFace.addLoop(newLoop);

    let hePlus = body.newHalfEdge();
    let heMinus = body.newHalfEdge();

    newEdge.hePlus = hePlus;
    newEdge.heMinus = heMinus;

    hePlus.edge = heMinus.edge = newEdge;

    hePlus.vertex = vFrom;
    heMinus.vertex = vTo;

    // TODO : is this criteria of oldLoop always correct?
    console.assert(vFrom.halfedge);
    let oldLoop = vFrom.halfedge!.loop!;
    console.assert(oldLoop);

    // Conventions
    // -----------
    // hePlus goes from vFrom to vTo
    // heMinus goes from vTo to vFrom
    // hePlus will be part of the new loop
    // heMinus will be part of the old loop

    // hePlus->mNext = heTo; // ?
    // heFrom->mate()->mNext = hePlus;
    // heMinus->mNext = heFrom; // ?
    // heTo->mate()->mNext = heMinus;

    // How to assign next pointers of hePlus and heMinus to place them in 
    // newLoop and oldLoop resp.
    //
    // First we will fit heMinus in oldLoop. We start walking the oldLoop.
    // A walk will visit each vertex twice (right?)
    // We walk until we visit vTo. At vTo, we remember the halfEdge reaching
    // to vTo along oldLoop (heMinusPrev).
    // We continue to walk. If we visit vTo again, before visiting vFrom we
    // update the heMinusPrev to the halfedge that brought us to vTo this time.
    // We continue the walk until we visit vFrom.
    // We call the halfedge leaving vFrom along oldLoop heMinusNext.
    //
    // In summary, we are walking the oldloop and find two nearest halfedges
    // in that loop between which we can fit heMinus.
    // Now we assign hePrev->next = heMinus and heMinus->next = heNext
    //
    // Later we are going to short-circuit the old loop between these two
    // half edges.

    let heCursor = oldLoop!.halfedge;
    console.assert(heCursor);
    let heMinusPrev = null;
    let heMinusNext = null;

    do {
      if(!heMinusNext) {
        console.assert(heCursor!.next);
        if(heCursor!.next!.vertex === vTo) {
          heMinusPrev = heCursor;
        }
      }
      if(heMinusPrev) {
        if(heCursor!.vertex === vFrom) {
          heMinusNext = heCursor;
          break;
        }
      }
      heCursor = heCursor!.next;
      console.assert(heCursor);
    } while(heCursor !== hePlus);

    console.assert(heMinusNext);
    console.assert(heMinusPrev);
    let shortCircuitFrom = heMinusNext!.prev!;
    let shortCircuitTo:HalfEdge|undefined = undefined; // = heMinusPrev.mate()
    let refHE = heMinusPrev!.mate();
    console.assert(refHE.vertex);
    refHE.vertex!.walk(refHE, he => {
      if(he.loop === oldLoop) {
        shortCircuitTo = he;
      }
    });
    console.assert(shortCircuitFrom);
    console.assert(shortCircuitTo);

    heMinus.next = heMinusNext!;
    heMinusNext!.prev = heMinus;
    heMinusPrev!.next = heMinus;
    heMinus.prev = heMinusPrev!;

    // Short circuit the old loop between two halfedges between which we
    // are inserting the new edge (and its new loop and face)
    shortCircuitFrom.next = hePlus;
    shortCircuitTo!.prev = hePlus;

    // As for hePlus's prev and next halfedges, we call derive them from
    // heFrom and heTo as follows
    // hePlus.next = heTo;
    // heFrom.mate().next = hePlus;
    // hePlus.prev = heFrom.mate();
    // heTo.prev = hePlus;
    hePlus.next = shortCircuitTo;
    hePlus.prev = shortCircuitFrom;

    heMinus.loop = newLoop;
    hePlus.loop = oldLoop;

    // Start traversing half-edges from heMinus and assign them to newLoop
    let hePtr = heMinus;
    do {
      hePtr.loop = newLoop;
      hePtr = hePtr.next!;
      console.assert(hePtr);
    } while(hePtr !== heMinus);

    newLoop.halfedge = heMinus;
    oldLoop.halfedge = hePlus;
    
    return {edge:newEdge,face:newFace};
  }

  /**
   * Kill Edge Face
   */
  static KEF(edge:Edge, face:Face) {
    console.assert(face.iloops.length === 1);
    let loopToKill = face.iloops[0];
    console.assert(loopToKill);
    let loopToSurvive:Loop;
    console.assert(edge.hePlus && edge.heMinus);
    if(edge.hePlus!.loop === loopToKill) {
      loopToSurvive = edge.heMinus!.loop!;
    } else {
      loopToSurvive = edge.hePlus!.loop!;
    }
    console.assert(loopToSurvive);
    console.assert(loopToSurvive!.halfedge);
    loopToSurvive.halfedge = loopToSurvive.halfedge!.next;
    console.assert(loopToKill!.halfedge);
    HalfEdge.walk(loopToKill!.halfedge!, he => {
      he.loop = loopToSurvive;
    });

    console.assert(
      edge.hePlus!.prev && edge.heMinus!.prev &&
      edge.hePlus!.next && edge.heMinus!.next
    );

    edge.hePlus!.prev!.next = edge.heMinus!.next;
    edge.heMinus!.prev!.next = edge.hePlus!.next;
    edge.hePlus!.next!.prev = edge.heMinus!.prev;
    edge.heMinus!.next!.prev = edge.hePlus!.prev;

    edge.hePlus!.unlink();
    edge.heMinus!.unlink();

    edge.hePlus!.next = undefined;
    edge.hePlus!.prev = undefined;
    edge.heMinus!.next = undefined;
    edge.heMinus!.prev = undefined;

    let body = face.body;

    body.removeHalfEdge(edge.hePlus!);
    body.removeHalfEdge(edge.heMinus!);

    edge.unlink();
    body.removeEdge(edge);

    body.removeFace(face);
    face.unlink();
  }

  /**
   * Kill Edge Make Ring 
   * (Ring = Loop in this library)
   */
  static KEMR(face:Face, v1:Vertex, v2:Vertex) : Loop {
    let hePos = face.findHalfEdge(v1, v2);
    console.assert(hePos);
    let heNeg = hePos!.mate();
    let edgeToKill = hePos!.edge;
    console.assert(edgeToKill);

    let oldLoop = hePos!.loop;
    console.assert(oldLoop);

    let heNextInNewLoop = hePos!.next;
    let hePrevInOldLoop = hePos!.prevInLoop();
    let heNextInOldLoop = hePos!.mate().next;
    let hePrevInNewLoop = hePos!.mate().prevInLoop();
    console.assert(heNextInNewLoop);
    console.assert(hePrevInNewLoop);
    console.assert(heNextInOldLoop);
    console.assert(hePrevInOldLoop);

    hePrevInNewLoop!.next = heNextInNewLoop;
    hePrevInOldLoop!.next = heNextInOldLoop;
    heNextInNewLoop!.prev = hePrevInNewLoop;
    heNextInOldLoop!.prev = hePrevInOldLoop;

    let ring = new Loop(face);
    face.addLoop(ring);

    // Old loop becomes the outer loop of face (needs reconsideration later)
    face.setOuterloop(oldLoop!);

    let heCursor = hePos!.next;

    do {
      heCursor!.loop = ring;
      heCursor = heCursor!.next;
    } while(heCursor !== hePos!.next);

    ring.halfedge = hePos!.next;

    console.assert(hePos!.vertex);
    if(hePos!.vertex!.halfedge === hePos) {
      hePos!.vertex!.halfedge = hePrevInOldLoop!.mate();
    }
    console.assert(heNeg.vertex);
    if(heNeg.vertex!.halfedge == heNeg) {
      heNeg.vertex!.halfedge = heNextInNewLoop;
    }

    oldLoop!.halfedge = hePrevInOldLoop;

    hePos!.next = undefined;
    hePos!.prev = undefined;
    heNeg!.next = undefined;
    hePos!.prev = undefined;
    heNeg!.unlink();
    hePos!.unlink();

    edgeToKill!.unlink();

    face.body.removeEdge(edgeToKill!);
    face.body.removeHalfEdge(hePos!);
    face.body.removeHalfEdge(heNeg!);

    return ring;
  }

  static MEKR(
    faceFrom:Face, fromHEV0:Vertex, fromHEV1:Vertex,
    faceTo:Face, toHEV0:Vertex, toHEV1:Vertex
  ) : Edge
  {
    let heFrom = faceFrom.findHalfEdge(fromHEV0, fromHEV1);
    let heTo = faceTo.findHalfEdge(toHEV0, toHEV1);
    let body = faceFrom.body;

    console.assert(heFrom);
    console.assert(heTo);

    let heFromNextInOuterLoop = heFrom!.next;
    console.assert(heFromNextInOuterLoop);
    let heToPrevInRing = heTo!.prevInLoop();
    console.assert(heToPrevInRing);

    let outerLoop = heFrom!.loop;
    let ringToKill = heTo!.loop;
    console.assert(ringToKill);

    let heCursor = heTo;
    do {
      heCursor!.loop = outerLoop;
      heCursor = heCursor!.next;
      console.assert(heCursor);
    } while(heCursor !== heTo);

    let hePos = body.newHalfEdge();
    let heNeg = body.newHalfEdge();

    let edge = body.newEdge();
    edge.hePlus = hePos;
    edge.heMinus = heNeg;
    hePos.edge = edge;
    heNeg.edge = edge;

    heFrom!.next = heNeg;
    heNeg.next = heTo;
    heToPrevInRing!.next = hePos;
    hePos.next = heFromNextInOuterLoop;

    heNeg.prev = heFrom;
    heTo!.prev = heNeg;
    hePos.prev = heToPrevInRing;
    heFromNextInOuterLoop!.prev = hePos;

    hePos.loop = outerLoop;
    heNeg.loop = outerLoop;
    hePos.vertex = toHEV0;
    heNeg.vertex = fromHEV1;

    ringToKill!.face.removeLoop(ringToKill!);
    ringToKill!.unlink();

    return edge;
  }
}