
import {Vector2} from '../src'

/// <reference path="qunit/index.d.ts" />

window.onload = () => {

  let qunitDiv = document.createElement('div');
  qunitDiv.setAttribute('id', 'qunit');
  document.body.appendChild(qunitDiv);

  let qunitFixtureDiv = document.createElement('div');
  qunitFixtureDiv.setAttribute('id','qunit-fixture');
  document.body.appendChild(qunitFixtureDiv);

  QUnit.test('Vector2 construction', assert => {
    let v = new Vector2(20,30);
    assert.equal(v.x, 20);
  });

  QUnit.test('Vector2 add', assert => {
    let v1 = new Vector2(20,30);
    let v2 = new Vector2(20,30);
    assert.equal(v1.add(v2).x, 40);
  });
}