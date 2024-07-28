import { Primitive } from "@/types";
import Node from "../../_classes/Node";
import Position from "@/lib/classes/Position";

class DynamicArrayNode<T extends Primitive> extends Node<T> {
  private _isCapacity: boolean;
  constructor(data: T, positon: Position, isCapacity = false) {
    super(data, positon);
    this._isCapacity = isCapacity;
  }
  get isCapacity() {
    return this._isCapacity;
  }
  set isCapacity(value: boolean) {
    this._isCapacity = value;
  }
}
