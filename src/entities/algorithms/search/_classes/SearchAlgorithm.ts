import Node from "@/entities/data-structures/linear/_classes/Node";
import { Primitive } from "@/types";
type callback<T extends Primitive> = (
  node: Node<T>,
  index: number
) => Promise<void>;
export default class SearchAlgorithm {
  static async linear<T extends Primitive>(
    array: Node<T>[],
    search: T,
    callback: callback<T> | null = null,
    isSorted = false,
    direction: "forward" | "reverse" = "forward"
  ): Promise<Node<T> | null> {
    for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if (callback) await callback(node, i);
      if (node.data === search) return node;
      const next = array[i + 1];
      if (isSorted && next && search && next.data) {
        if ((direction === "forward" && next.data > search)|| (direction === "reverse" && next.data < search)) return null;
      }

    }

    return null;
  }
}

