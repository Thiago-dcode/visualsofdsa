import Position from "./Position";

export default class SuperPosition extends Position {
  private _prev: Position;
  constructor(x: number, y: number) {
    super(x, y);
    this._prev = new Position(x, y);
  }

  get x() {
    return this._x;
  }

  set x(x: number) {
    this._prev.x = this._x;
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y: number) {
    this._prev.y = this._y;
    this._y = y;
  }
  get() {
    return {
      x: this._x,
      y: this._y,
    };
  }
  set(x: number, y: number) {
    this._prev.x = this._x;
    this._prev.y = this._y;
    this._x = x;
    this._y = y;
  }

  get prev() {
    return this._prev;
  }
}
