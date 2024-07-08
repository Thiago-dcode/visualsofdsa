import { Primitive, Ref } from "@/types";
import Node from "../../_classes/Node";
import Position from "@/lib/classes/Position";

export default class LinkedListNode<T extends Primitive> extends Node<T> {
  private _prev: LinkedListNode<T> | null = null;
  private _next: LinkedListNode<T> | null = null;

  constructor(data: T, position: Position, ref: Ref = null) {
    super(data, position, ref);
  }

  get prev(): LinkedListNode<T> | null {
    return this._prev;
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
