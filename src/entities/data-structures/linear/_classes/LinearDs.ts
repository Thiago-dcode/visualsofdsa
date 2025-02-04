import { listName, Primitive } from "@/types";
import LinkedList from "../linked-list/classes/LinkedList";
import LinkedListNode from "../linked-list/classes/LinkedListNode";
import List from "./List";
import { speed } from "@/types";
export default abstract class LinearDs<T extends Primitive> extends List {
  protected linkedList: LinkedList<T>;
  private _speed: speed;
  private _width: number;
  constructor(data: T[] = [], _name: listName) {
    super(_name);
    this.linkedList = new LinkedList<T>(data);
    this._speed = 2;
    this._width = 350;
  }

  get width() {
    return this._width;
  }
  set width(width: number) {
    if (width < 100 || width > 600) {
      return;
    }
    this._width = width;
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
  get speed() {
    return this._speed;
  }
  set speed(speed: speed) {
    if (speed < 1 || speed > 3) {
      return;
    }
    this._speed = speed;
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
