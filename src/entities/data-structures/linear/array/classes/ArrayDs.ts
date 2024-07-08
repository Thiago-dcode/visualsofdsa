import { Primitive } from "@/types";
import List from "../../_classes/List";
import Node from "../../_classes/Node";
import Position from "../../../../../lib/classes/Position";

export default class ArrayDs<T extends Primitive> extends List {
  private array: Node<T>[];
  private currentPosition = 0;
  constructor(size: number) {
    super("array");
    this.array = new Array(size);
  }

  get isEmpty() {
    return this.array.length === 0;
  }
  get isFull() {
    return this.currentPosition === this.array.length;
  }
  get length() {
    return this.array.length;
  }
  push(data: T) {
    this.array[this.currentPosition] = new Node(data, new Position(0, 0));
    this.currentPosition++;
  }
}
