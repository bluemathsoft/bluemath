

class Vector2 {

  x : number;
  y : number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  add(other:Vector2) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

}

export default Vector2;