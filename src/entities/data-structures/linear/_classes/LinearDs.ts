import { Primitive } from "@/types";
import LinkedList from "../linkedList/classes/LinkedList";
import LinkedListNode from "../linkedList/classes/LinkedListNode";
import List from "./List";

export default abstract class LinearDs<T extends Primitive> extends List {
  protected linkedList: LinkedList<T>;
  constructor(data: T[] = [], _name: string) {
    super(_name);
    this.linkedList = new LinkedList<T>(data);
  }

  get isEmpty() {
    return this.size == 0;
  }
  get isFull() {
    return this.size == this.maxSize;
  }

  get size() {
    return this.linkedList.size;
  }

  flush() {
    this.linkedList.clean();
  }

  get toArray() {
    return this.linkedList.toArray();
  }
  get toNodeArray() {
    return this.linkedList.toNodeArray();
  }
  abstract peek(): T | null;
  abstract peekNode(): LinkedListNode<T> | null;
  abstract currentNode(): LinkedListNode<T> | null;
}
