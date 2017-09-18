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

import * as topo from '../../src/topo'
import {arr} from '@bluemath/common'

export default function testEulerOps() {

  let pA = arr([100,100]);
  let pB = arr([200,100]);
  let pC = arr([200,200]);
  let pD = arr([100,200]);
  let pE = arr([300,300]);

  QUnit.module('Euler Ops', () => {
    QUnit.test('MVFS-KVFS', assert => {
      topo.IDManager.init();
      let result = topo.EulerOps.MVFS(pA);

      assert.ok(result.body !== null);
      assert.equal(result.body.faces.length, 1);
      assert.equal(result.body.vertices.length, 1);
      assert.equal(result.body.halfedges.length, 1);
      assert.equal(result.body.edges.length, 0);

      assert.equal(result.vertex.degree(), 0);

      assert.equal(result.face.iloops.length, 1);

      topo.EulerOps.KVFS(result.body);
    });

    /*
      v0  -- e0 --  v1
    */
    QUnit.module('MEV-KEV', () => {
      QUnit.test('1', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pA);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 1);
        assert.equal(f0.iloops[0].length, 2);

        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    /*
      v0  -- e0 --  v1
                    |
                    |
                    e1
                    |
                    |
                    v2
    */
      QUnit.test('2', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 1);
        assert.equal(f0.iloops[0].length, 2);

        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    /*
      v0  -- e0 -- v1
                /   |
              /     |
           e2      e1
          /         |
        /           |
      v3           v2
    */
      QUnit.test('3 branch', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v1,pD);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 1);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    });

    QUnit.module('MEF-KEF', () => {

      /*
        v0  -- e0 --  v1
          \           |
            \         |
              e2      e1
                 \    |
                   \  |
                      v2
      */
      QUnit.test('3-Edge face', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);

        let {edge:e2,face:f1} = topo.EulerOps.MEF(f0,v2,v1,v0,v1);

        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 3);

        topo.EulerOps.KEF(e2,f1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
          \           |
            \         |
              e2      e1
                 \    |
                   \  |
                      v2
      */
      QUnit.test('3-Edge face (shorthand)', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);

        let {edge:e2,face:f1} = topo.EulerOps.MEF(f0,v2,undefined,v0,undefined);

        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 3);

        topo.EulerOps.KEF(e2,f1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
        |             |
        |             |
        e3            e1
        |             |
        |             |
        v3  -- e2 --  v2
      */
      QUnit.test('Rectangular face', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v0,v1,v3,v2);
        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 4);
        assert.equal(f1.iloops[0].length, 4);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e3      e1
            /         |
          /           |
        v3  -- e2 --  v2
      */
      QUnit.test('Topo 4V4E2F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v1,v2,v3,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 5);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e3      e1
            /         |
          /           |
        v3  -- e2 --  v2
      */
      QUnit.test('Topo 4V4E2F otherdir', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v3,v2,v1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 5);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e4      e1
            /         |
          /           |
        v3  -- e2 --  v2
            \
                \
                   e3
                      \
                          \
                             v4
      */
      QUnit.test('Topo 5V5E2F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);
        let {vertex:v4,edge:e3} = topo.EulerOps.MEV(f0,v3,pE);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        let {edge:e4,face:f1} = topo.EulerOps.MEF(f0,v1,v2,v3,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 3);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 7);

        topo.EulerOps.KEF(e4,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        topo.EulerOps.KEV(e3,v4);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e4      e1
            /         |
          /           |
        v3  -- e2 --  v2
            \
                \
                   e3
                      \
                          \
                             v4
      */
      QUnit.test('Topo 5V5E2F otherdir', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);
        let {vertex:v4,edge:e3} = topo.EulerOps.MEV(f0,v3,pE);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        let {edge:e4,face:f1} = topo.EulerOps.MEF(f0,v3,v2,v1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 3);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 7);

        topo.EulerOps.KEF(e4,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        topo.EulerOps.KEV(e3,v4);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });
    });
  });
}