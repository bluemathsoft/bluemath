
import {EPSILON} from '../constants'
import * as utils from '../utils'

/**
 * 2D Vector
 */
export default class Vector2 {

  x : number;
  y : number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add other vector to this
   */
  add(other:Vector2) : Vector2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Subtract other vector from this
   */
  sub(other:Vector2) : Vector2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  /**
   * Multiply by a constant
   */
  mul(k:number) : Vector2 {
    this.x *= k;
    this.y *= k;
    return this;
  }

  /**
   * Square length of this vector
   */
  lenSq() : number {
    return this.x*this.x + this.y*this.y;
  }

  /**
   * Length of this vector
   */
  len() : number {
    return Math.sqrt(this.lenSq());
  }

  /**
   * Unit vector of this vector
   */
  unit() : Vector2 {
    let len = this.len();
    if(utils.isZero(len)) {
      return new Vector2(0,0);
    } else {
      return new Vector2(this.x/len, this.y/len);
    }
  }

  /**
   * Is this vector non-zero within given tolerance
   * (i.e. either of its components are greater than tolerance in magnitude)
   */
  isNonZero(tolerance=EPSILON) : boolean {
    return Math.abs(this.x) > tolerance || Math.abs(this.y) > tolerance;
  }

  /**
   * Is this vector zero within given tolerance
   * (i.e. both of its components are lesser than tolerance in magnitude)
   */
  isZero(tolerance=EPSILON) : boolean {
    return !this.isNonZero(tolerance);
  }

  /**
   * Copy of this vector
   */
  clone() : Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Square distance to other vector
   */
  distSq(other:Vector2) : number {
    return this.clone().sub(other).lenSq();
  }

  /**
   * Distance to other vector
   */
  dist(other:Vector2) : number {
    return Math.sqrt(this.distSq(other));
  }

  /**
   * Dot product with other vector
   */
  dot(other:Vector2) : number {
    return this.x*other.x + this.y*other.y;
  }

  /**
   * Cross product with other vector
   */
  cross(other:Vector2) : number {
    return this.x*other.y - this.y*other.x;
  }

  /**
   * Round to nearest integer, same rules as Math.round
   */
  round() : Vector2 {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  /**
   * Is equal to other vector, within given tolerance
   */
  isEqual(other:Vector2, tolerance=EPSILON) : boolean {
    return Math.abs(this.x-other.x) < tolerance &&
      Math.abs(this.y-other.y) < tolerance;
  }

  /**
   * Vector orthogonal to this vector
   */
  orthogonal() : Vector2 {
    return new Vector2(this.y, -this.x);
  }

  /**
   * String representation
   */
  toString(precision=2) : string {
    return `[${this.x.toFixed(precision)},${this.y.toFixed(precision)}]`
  }

  /**
   * Return the min-x and min-y values for variable number of input point vectors
   */
  static low(points : Array<Vector2>) {
    let xlow = Infinity;
    let ylow = Infinity;
    for(let point of points) {
      xlow = Math.min(point.x, xlow);
      ylow = Math.min(point.y, ylow);
    }
    return new Vector2(xlow, ylow);
  }

  /**
   * Return the max-x and max-y values for variable number of input point vectors
   */
  static high(points : Array<Vector2>) {
    let xhigh = -Infinity;
    let yhigh = -Infinity;
    for(let point of points) {
      xhigh = Math.max(point.x, xhigh);
      yhigh = Math.max(point.y, yhigh);
    }
    return new Vector2(xhigh, yhigh);
  }
}
