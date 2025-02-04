import { Primitive } from "@/types";
import LinearDs from "../../_classes/LinearDs";
import Position from "../../../../../lib/classes/position/Position";
import LinkedListNode from "../../linked-list/classes/LinkedListNode";
export default class Stack<T extends Primitive> extends LinearDs<T> {
  constructor(data: T[] = []) {
    super(data, "stack");
  }
  push(element: T) {
    if (this.size >= this.maxSize) {
      return;
    }
    this.linkedList.addLast(
      element,
      new Position(
        0,
        (this.nodeHeight + this.nodeHeightSpacing) * this.size + this.nodeHeightSpacing
      )
    );
  }
  pop(): T | null {
    return this.linkedList.deleteLast();
  }
  peek(): T | null {
    return this.linkedList.getLast();
  }
  peekNode(): LinkedListNode<T> | null {
    return this.linkedList.findNode(this.size - 1);
  }
  currentNode(): LinkedListNode<T> | null {
    return this.peekNode();
  }
}
