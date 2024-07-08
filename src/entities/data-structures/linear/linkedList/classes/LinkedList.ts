import { Primitive } from "@/types";
import LinkedListNode from "./LinkedListNode";
import Position from "../../../../../lib/classes/Position";
import IndexOutOfBoundsError from "../../../../../lib/errors/IndexOutOfTheBondError";

export default class LinkedList<T extends Primitive> {
  private _head: LinkedListNode<T> | null = null;
  private _tail: LinkedListNode<T> | null = null;
  private _size: number;
  constructor(data: T | T[] = []) {
    this._size = 0;
    if (Array.isArray(data)) {
      data.forEach((el) => {
        this.add(el);
      });
    } else {
      this.add(data);
    }
  }

  get(index: number): T | null {
    if (index === 0) {
      return this.getFirst();
    }
    if (index === this.size - 1) {
      return this.getLast();
    }
    const node = this.findNode(index);
    return node ? node.data : node;
  }
  getFirst(): T | null {
    if (!this.head) return null;
    return this.head?.data;
  }
  getLast(): T | null {
    if (!this.tail) return null;
    return this.tail?.data;
  }

  add(data: T, index: number = this._size, position = new Position(0, 0)) {
    const newNode = new LinkedListNode(data, position);
    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      if (index === this._size) {
        this._addLast(newNode);
      } else if (index === 0) {
        this._addFirst(newNode);
      } else {
        const node = this.findNode(index);
        newNode.next = node;
        if (node?.prev) {
          newNode.prev = node.prev;
          node.prev.next = newNode;
          node.prev = newNode;
        }
      }
    }
    this._size++;
  }

  addFirst(data: T, position = new Position(0, 0)) {
    this._addFirst(new LinkedListNode(data, position));
    this._size++;
  }
  addLast(data: T, position = new Position(0, 0)) {
    this._addLast(new LinkedListNode(data, position));
    this._size++;
  }

  private _addFirst(node: LinkedListNode<T>) {
    node.next = this._head;
    if (!this._head) {
      this._head = node;
      this._tail = node;
      return;
    }
    if (this._head) {
      this._head.prev = node;
    }
    this._head = node;
  }
  private _addLast(node: LinkedListNode<T>) {
    node.prev = this.tail;
    if (!this._head) {
      this._head = node;
      this._tail = node;
      return;
    }
    if (this._tail) {
      this._tail.next = node;
    }
    this._tail = node;
  }

  delete(index: number) {
    if (index === 0) {
      return this.deleteFirst();
    }
    if (index === this.size - 1) {
      return this.deleteLast();
    } else {
      const node = this.findNode(index);
      if (node?.prev && node.next) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
      }
      this._size--;
      return node ? node.data : null;
    }
  }
  deleteFirst() {
    if (!this._head) return null;
    const data = this._head.data;
    if (this.head?.next) {
      this._head = this.head.next;
      this._head.prev = null;
    } else {
      this._head = null;
      this._tail = null;
    }
    this._size--;
    return data;
  }
  deleteLast() {
    if (!this._tail) return null;

    const data = this._tail.data;

    if (this._tail.prev) {
      this._tail = this._tail.prev;
      this._tail.next = null;
    } else {
      this._head = null;
      this._tail = null;
    }
    this._size--;
    return data;
  }
  private throwIfOutOfTheBounds(index: number, includesSize = true) {
    if (index < 0 || index > (includesSize ? this.size : this.size - 1)) {
      //throw error
      throw new IndexOutOfBoundsError(
        `Index: ${index} doesn't exist on linkedList.size: ${this.size}`
      );
    }
  }
  findNode(index: number) {
    this.throwIfOutOfTheBounds(index, false);
    let node: LinkedListNode<T> | null = null;
    if (this.isTail(index)) {
      let position = this._size - 1;
      node = this._tail;
      do {
        if (position == index) {
          break;
        }
        if (node) {
          node = node.prev;
        }
        position--;
      } while (position >= 0 || node);
    } else if (!this.isTail(index)) {
      let position = 0;
      node = this._head;
      do {
        if (position === index) {
          break;
        }
        if (node) {
          node = node.next;
        }
        position++;
      } while (position < this.size || node);
    }
    return node;
  }

  clean() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }
  toArray() {
    const array: T[] = new Array(this.size);
    let node = this._head;
    let i = 0;
    while (node) {
      array[i] = node.data;
      node = node.next;
      i++;
    }
    return array;
  }
  toNodeArray() {
    const array: LinkedListNode<T>[] = new Array(this.size);
    let node = this._head;
    let i = 0;
    while (node) {
      array[i] = node;
      node = node.next;
      i++;
    }
    return array;
  }
  private isTail(index: number): boolean {
    if (index >= this._size) return true;
    return this._size - index < index;
  }
  get head() {
    return this._head;
  }
  get tail() {
    return this._tail;
  }

  get size() {
    return this._size;
  }
}
