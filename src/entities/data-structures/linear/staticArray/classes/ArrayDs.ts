import { Primitive } from "@/types";
import List from "../../_classes/List";
import Node from "../../_classes/Node";
import Position from "../../../../../lib/classes/Position";

export default class FixedArray<T extends Primitive> {
  private array: Node<T>[];
  private positionsOcuppied = 0;
  constructor(size: number) {
    this.array = new Array(size);
  }

  async search(data: T, handleAnimation: () => Promise<unknown>) {
    for (let i = 0; i < this.array.length; i++) {
      const node = this.array[i];
      if (node.data === data) {
        //do something
        break;
      }
      await handleAnimation();
    }
  }
  get isEmpty() {
    return this.positionsOcuppied === 0;
  }
  get length() {
    return this.array.length;
  }
  get self() {
    return this.array;
  }
}
