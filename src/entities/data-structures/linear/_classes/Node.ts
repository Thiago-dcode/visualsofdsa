import { Primitive, Ref } from "@/types";
import Position from "@/lib/classes/Position";

export default class Node<T extends Primitive> {
  private _data: T;
  private _ref: Ref;
  private static _id: number = 0;
  private __id: number;
  private _position: Position;
  constructor(data: T, position: Position, ref: Ref = null) {
    this._ref = ref;
    this.__id = Node._id;
    Node._id++;
    this._position = position;
    this._data = data;
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
}
