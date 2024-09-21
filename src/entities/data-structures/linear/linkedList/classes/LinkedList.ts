import { Primitive } from "@/types";
import LinkedListNode from "./LinkedListNode";
import Position from "../../../../../lib/classes/Position";
import IndexOutOfBoundsError from "../../../../../lib/errors/IndexOutOfTheBondError";
import List from "../../_classes/List";
type callback =
  | ((
      node: LinkedListNode<Primitive> | null,
      next: LinkedListNode<Primitive> | null,
      prev: LinkedListNode<Primitive> | null
    ) => Promise<void>)
  | null;
export default class LinkedList<T extends Primitive> extends List {
  private _head: LinkedListNode<T> | null = null;
  private _tail: LinkedListNode<T> | null = null;
  private _size: number;
  constructor(data: T | T[] = []) {
    super("linkedList");
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
  getNode(index: number): LinkedListNode<T> | null {
    if (index === 0) {
      return this.head;
    }
    if (index === this.size - 1) {
      return this.tail;
    }
    const node = this.findNode(index);
    return node;
  }
  getFirst(): T | null {
    if (!this.head) return null;
    return this.head?.data;
  }
  getLast(): T | null {
    if (!this.tail) return null;
    return this.tail?.data;
  }

  async add(
    data: T,
    index: number = this._size,
    position = new Position(0, 0),
    beforeAddCallback: callback = null
  ) {
    const newNode = new LinkedListNode(data, position);
    if (!this._head) {
      if (beforeAddCallback) await beforeAddCallback(newNode, null, null);

      this._head = newNode;
      this._tail = newNode;
    } else {
      if (index === this._size) {
        if (beforeAddCallback) {
          const prev =
            this.size === 1 ? this.head : this.tail ? this.tail.prev : null;
          await beforeAddCallback(newNode, null, prev);
        }
        this.addLastNode(newNode);
      } else if (index === 0) {
        if (beforeAddCallback)
          await beforeAddCallback(
            newNode,
            this.head ? this.head.next : null,
            null
          );
        this._addFirst(newNode);
      } else {
        const node = this.findNode(index);
        if (beforeAddCallback)
          await beforeAddCallback(newNode, node, node ? node.prev : null).catch(
            (e) => {
              console.log("Error beforeAddCallback", e);
            }
          );
        newNode.next = node;
        if (node?.prev) {
          newNode.prev = node.prev;
          node.prev.next = newNode;
          node.prev = newNode;
        }
      }
    }
    this._size++;
    return newNode;
  }

  addFirst(data: T, position = new Position(0, 0)) {
    this._addFirst(new LinkedListNode(data, position));
    this._size++;
  }
  addLast(data: T | LinkedListNode<T>, position = new Position(0, 0)) {
    this.addLastNode(
      data instanceof LinkedListNode ? data : new LinkedListNode(data, position)
    );
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
  private addLastNode(node: LinkedListNode<T>) {
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

  async delete(index: number, beforeDeleteCallback: callback = null) {
    if (index === 0) {
      if (beforeDeleteCallback)
        await beforeDeleteCallback(
          this.head,
          this.head ? this.head.next : null,
          null
        );
      return this.deleteFirst();
    } else if (index === this.size - 1) {
      if (beforeDeleteCallback)
        await beforeDeleteCallback(
          this.tail,
          null,
          this.tail ? this.tail.prev : null
        );
      return this.deleteLast();
    } else {
      const node = this.findNode(index);
      if (node?.prev && node.next) {
        if (beforeDeleteCallback)
          await beforeDeleteCallback(node, node.next, node.prev);
        node.prev.next = node.next;
        node.next.prev = node.prev;
      }
      this._size--;
      return node ? node.data : null;
    }
  }
  deleteFirst() {
    const node = this.deleteFirstAndGetNode();
    return node ? node.data : null;
  }
  deleteFirstAndGetNode() {
    const node = this.head;
    if (node) {
      if (this.head?.next) {
        this._head = this.head.next;
        this._head.prev = null;
      } else {
        this._head = null;
        this._tail = null;
      }
      this._size--;
    }
    return node;
  }
  deleteLast() {
    if (!this._tail) return null;

    const data = this._tail.data;

    if (this._tail.prev) {
      this._tail.prev.next = null;
      this._tail = this._tail.prev;
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
  async traverse(
    direction: "forward" | "backward" = "forward",
    onTraverse: (
      node: LinkedListNode<Primitive>,
      index: number
    ) => Promise<void> = async () => {}
  ) {
    let node = direction === "forward" ? this.head : this.tail;
    let i = 0;
    while (node) {
      await onTraverse(node, i);
      if (direction === "forward") node = node.next;
      else {
        node = node.prev;
      }
      i++;
    }
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
  get isEmpty() {
    return this.size === 0;
  }
  get isFull() {
    return false;
  }
  get size() {
    return this._size;
  }
}
