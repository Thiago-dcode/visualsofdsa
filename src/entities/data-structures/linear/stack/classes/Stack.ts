import { Primitive } from "@/types";
import LinearDs from "../../_classes/LinearDs";
import Position from "../../../../../lib/classes/position/Position";
import LinkedListNode from "../../linked-list/classes/LinkedListNode";
import StackOverFlowError from "@/lib/errors/StackOverFlowError";
export default class Stack<T extends Primitive> extends LinearDs<T> {
  constructor(data: T[] = []) {
    super(data, "stack");
  
  }
  async add(element: T) {
    
    if (this.size >= this.maxSize) {
      throw new StackOverFlowError();
    }
   return await this.linkedList.addLast(
      element,
      new Position( 
        0,
        (this.nodeHeight + this.nodeHeightSpacing) * this.size + this.nodeHeightSpacing
      )
    );
  }
 async remove() {
    return await this.linkedList.deleteAndGetNode(this.size - 1);
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
