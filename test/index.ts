
import {utils, basic} from '../src'

let {Matrix, Vector2} = basic;

/// <reference path="qunit/index.d.ts" />

window.onload = () => {

  let qunitDiv = document.createElement('div');
  qunitDiv.setAttribute('id', 'qunit');
  document.body.appendChild(qunitDiv);

  let qunitFixtureDiv = document.createElement('div');
  qunitFixtureDiv.setAttribute('id','qunit-fixture');
  document.body.appendChild(qunitFixtureDiv);

  QUnit.module('Vector2');

  QUnit.test('construction', assert => {
    let v = new Vector2(20,30);
    assert.equal(v.x, 20);
  });
  QUnit.test('add', assert => {
    let v1 = new Vector2(20,30);
    let v2 = new Vector2(20,30);
    assert.equal(v1.add(v2).x, 40);
  });
  QUnit.test('sub', assert => {
    let v1 = new Vector2(20,30);
    let v2 = new Vector2(14,22);
    assert.equal(v1.sub(v2).y, 8);
  });
  QUnit.test('mul', assert => {
    let v = new Vector2(20,30);
    assert.equal(v.mul(0.1).y, 3);
  });
  QUnit.test('lenSq', assert => {
    let v = new Vector2(12,12);
    assert.equal(v.lenSq(), 2*144);
  });
  QUnit.test('len', assert => {
    let v = new Vector2(12,12);
    assert.ok(utils.isEqualFloat(v.len(), 12*Math.sqrt(2)));
  });
  QUnit.test('unit', assert => {
    let v = new Vector2(12,12);
    assert.equal(v.unit().len(), 1);
  });
  QUnit.test('isNonZero', assert => {
    let v = new Vector2(20,30);
    assert.equal(v.isNonZero(), true);
  });
  QUnit.test('isZero', assert => {
    let v = new Vector2(0,0);
    assert.equal(v.isZero(), true);
  });
  QUnit.test('distSq', assert => {
    let v = new Vector2(0,0);
    assert.equal(v.distSq(new Vector2(12,12)), 2*144);
  });
  QUnit.test('dist', assert => {
    let v = new Vector2(0,0);
    assert.ok(utils.isEqualFloat(v.dist(new Vector2(12,12)), 12*Math.sqrt(2)));
  });
  QUnit.test('dot', assert => {
    let v = new Vector2(5,4);
    assert.equal(v.dot(new Vector2(2,3)), 22);
  });
  QUnit.test('cross', assert => {
    let v = new Vector2(5,4);
    assert.equal(v.cross(new Vector2(2,3)), 7);
  });
  QUnit.test('round', assert => {
    let v = new Vector2(5.4533,4.8766);
    assert.ok(v.round().isEqual(new Vector2(5,5)));
  });
  QUnit.test('low', assert => {
    let varr = [
      new Vector2(2,4),
      new Vector2(12,0),
      new Vector2(3,-4),
      new Vector2(21,35),
    ];
    assert.ok(Vector2.low(varr).isEqual(new Vector2(2,-4)));
  });
  QUnit.test('high', assert => {
    let varr = [
      new Vector2(2,4),
      new Vector2(12,0),
      new Vector2(3,-4),
      new Vector2(21,35),
    ];
    assert.ok(Vector2.high(varr).isEqual(new Vector2(21,35)));
  });
  QUnit.test('toString', assert => {
    assert.equal(new Vector2(3.5466,-6.0988).toString(), '[3.55,-6.10]');
    assert.equal(new Vector2(3.5466,-6.0988).toString(3), '[3.547,-6.099]');
  });

  QUnit.module('Matrix');

  QUnit.test('construction', assert => {
    assert.notEqual(new Matrix(), null);
  });
}