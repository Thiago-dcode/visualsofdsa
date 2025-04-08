import { Primitive } from "@/types";
import LinearDs from "../../_classes/LinearDs";
import Position from "../../../../../lib/classes/position/Position";
import LinkedListNode from "../../linked-list/classes/LinkedListNode";
import StackOverFlowError from "@/lib/errors/StackOverFlowError";
export default class Queue<T extends Primitive> extends LinearDs<T> {
  constructor(data: T[] = []) {
    super(data, "queue");
  }
    async add(data: T| LinkedListNode<T>) {
    if (this.size >= this.maxSize) {
      throw new StackOverFlowError();
    }
  
    return await this.linkedList.addLast(
      data,
      new Position(
        0,
        this.maxSize * (this.nodeHeight + this.nodeHeightSpacing) - ((1+this.size )* (this.nodeHeight + this.nodeHeightSpacing)) + this.nodeHeightSpacing
      )
    );
  }

  async remove() {
    if (this.size <= 0) return null;
    return await this.linkedList.deleteAndGetNode(0);
  }
  dequeueNode() {
    if (this.size <= 0) return null;
    return this.linkedList.deleteFirstAndGetNode();
  }
  peek() {
    return this.linkedList.getFirst();
  }
  peekNode() {
     return this.linkedList.findNode(0);   
  }
  currentNode() {
    return this.linkedList.findNode(this.size - 1);
  }
}
