import { Primitive } from "@/types";
import LinearDs from "../../_classes/LinearDs";
import Position from "../../../../../lib/classes/Position";
import Node from "../../_classes/Node";
import LinkedListNode from "../../linkedList/classes/LinkedListNode";

export default class Queue<T extends Primitive> extends LinearDs<T> {
  constructor(data: T[] = []) {
    super(data, "queue");
  }
  enqueue(data: T| LinkedListNode<T>) {
    if (this.size >= this.maxSize) {
      return;
    }
    this.linkedList.addLast(
      data,
      new Position(
        0,
        (this.nodeHeight + this.nodeHeight) * this.size + this.nodeHeight
      )
    );
  }

  dequeue() {
    if (this.size <= 0) return null;
    return this.linkedList.deleteFirst();
  }
  dequeueNode() {
    if (this.size <= 0) return null;
    return this.linkedList.deleteFirstAndGetNode();
  }
  peek() {
    return this.linkedList.getFirst();
  }
  peekNode() {
    try {
      return this.linkedList.findNode(0);
    } catch (e) {
      return null;
    }
  }
  currentNode() {
    return this.linkedList.findNode(this.size - 1);
  }
}
