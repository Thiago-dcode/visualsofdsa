import { Primitive, Ref } from "@/types";

import Memory from "@/lib/classes/Memory";
import Position from "@/lib/classes/position/Position";

export default class Node<T extends Primitive> extends Memory {
  private _data: T;
  private _ref: Ref;
  private static _id: number = 0;
  private __id: number;
  private _position: Position;
  private _color: string;

  constructor(data: T, position: Position, ref: Ref = null, color = "") {
    super();
    this._ref = ref;
    this.__id = Node._id;
    Node._id++;
    this._position = position;
    this._data = data;
    this._color = color;
  }

  get id() {
    return this.__id;
  }
  // Getter for the value
  get data(): T {
    return this._data;
  }
  get position() {
    return this._position;
  }
  get ref(): Ref {
    return this._ref;
  }
  set ref(ref: Ref) {
    this._ref = ref;
  }

  // Setter for the value
  set data(data: T) {
    this._data = data;
  }
  get color() {
    return this._color;
  }
  set color(color: string) {
    this._color = color;
  }
  clone(withRef = false) {
    return new Node(
      this.data,
      new Position(this.position.x, this.position.y),
      withRef ? this.ref : null,
      this._color
    );
  }
}
