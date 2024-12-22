import Position from "@/lib/classes/position/Position";
import { Primitive } from "@/types";
import Node from "../../_classes/Node";

export default class StackNode<T extends Primitive> extends Node<T> {
  constructor(data: T, position: Position, ref = null) {
    super(data, position, ref);
    // (StackNode.height + StackNode.spacing) * this._index + StackNode.spacing;
  }
}
