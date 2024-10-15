import { Primitive, Ref } from "@/types";
import Node from "../../_classes/Node";
import Position from "@/lib/classes/Position";
import { Edge } from "@/lib/classes/Edge";

export default class LinkedListNode<T extends Primitive> extends Node<T> {
  private _prev: LinkedListNode<T> | null = null;
  private _prevEdge: Edge;
  private _next: LinkedListNode<T> | null = null;
  private _nextEdge: Edge;

  constructor(data: T, position: Position, ref: Ref = null) {
    super(data, position, ref);
    this._prevEdge = new Edge();
    this._nextEdge = new Edge();
  }

  get prev(): LinkedListNode<T> | null {
    return this._prev;
  }
  get prevEdge() {
    return this._prevEdge;
  }
  get nextEdge() {
    return this._nextEdge;
  }
  get next(): LinkedListNode<T> | null {
    return this._next;
  }
  set prev(prev: LinkedListNode<T> | null) {
    this._prev = prev;
  }
  set next(next: LinkedListNode<T> | null) {
    this._next = next;
  }
}
