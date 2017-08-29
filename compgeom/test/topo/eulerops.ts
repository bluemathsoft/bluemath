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

export default function testEulerOps() {

  topo.IDManager.init(['B','V','E','F','L','HE']);
  QUnit.module('Euler Ops', () => {
    QUnit.test('MVFS-KVFS', assert => {
      let result = topo.EulerOps.MVFS();

      assert.ok(result.body !== null);
      assert.equal(result.body.faces.length, 1);
      assert.equal(result.body.vertices.length, 1);
      assert.equal(result.body.halfedges.length, 1);
      assert.equal(result.body.edges.length, 0);

      assert.equal(result.vertex.degree(), 0);

      assert.equal(result.face.iloops.length, 1);

      topo.EulerOps.KVFS(result.body);
    });

    QUnit.module('MEV-KEV', () => {
      QUnit.test('1', assert => {
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS();
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 1);
        assert.equal(f0.iloops[0].length, 2);

        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      QUnit.test('2', assert => {
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS();
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      QUnit.test('3 branch', assert => {
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS();
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 1);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    });
  });
}