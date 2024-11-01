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
    if (!array.length || search === null) return null;
    const last = array[array.length - 1];
    if (last.data === search) return last;
    if (
      isSorted &&
      last.data !== null &&
      ((direction === "forward" && search > last.data) ||
        (direction === "reverse" && search < last.data))
    )
      return null;

    for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if (callback) await callback(node, i);
      if (node.data === search) return node;
      if (isSorted) {
        const next = array[i + 1];
        if (next && next.data) {
          const nextData = next.data;
          if (
            (direction === "forward" && nextData > search) ||
            (direction === "reverse" && nextData < search)
          )
            return null;
        }
      }
    }

    return null;
  }
}
