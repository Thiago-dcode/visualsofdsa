export default class Position {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  set x(x: number) {
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y: number) {
    this._y = y;
  }
  get() {
    return {
      x: this._x,
      y: this._y,
    };
  }
  set(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
}
