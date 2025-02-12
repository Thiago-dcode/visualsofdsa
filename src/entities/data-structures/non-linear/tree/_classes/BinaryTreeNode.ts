import Node from "@/entities/data-structures/linear/_classes/Node";
import { Edge } from "@/lib/classes/Edge";
import Position from "@/lib/classes/position/Position";
import { Primitive, Ref } from "@/types";

export default class BinaryTreeNode<T extends Primitive> extends Node<T> {
  left: BinaryTreeNode<T> | null = null;
  protected _leftEdge: Edge;
  right: BinaryTreeNode<T> | null = null;
  protected _rightEdge: Edge;
  constructor(
    data: T,
    position: Position = new Position(0, 0),
    ref: Ref = null,
    color: string = ""
  ) {
    super(data, position, ref, color);
    this._leftEdge = new Edge();
    this._rightEdge = new Edge();
  }

  get leftEdge() {
    return this._leftEdge;
  }
  get rightEdge() {
    return this._rightEdge;
  }
}
