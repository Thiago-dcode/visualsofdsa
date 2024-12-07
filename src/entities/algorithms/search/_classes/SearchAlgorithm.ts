import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, Primitive } from "@/types";
type CallbackLinear<T extends Primitive> = (
  node: Node<T>,
  index: number,
  found: boolean
) => Promise<void>;
type CallbackBinary<T extends Primitive> = (
  middle: number,
  start: number,
  end: number
) => Promise<void>;
export default class SearchAlgorithm {
  static async linear<T extends Primitive>(
    array: Node<T>[],
    search: T,
    callback: CallbackLinear<T> | null = null,
    isSorted = false,
    direction: Direction = "ascending"
  ): Promise<Node<T> | null> {
    if (!array.length || search === null) return null;
    const last = array[array.length - 1];
    if (last.data === search) {
      if (callback) await callback(last, array.length - 1, true);
      return last;
    }
    if (
      isSorted &&
      last.data !== null &&
      ((direction === "ascending" && search > last.data) ||
        (direction === "descending" && search < last.data))
    ) {
      return null;
    }

    for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if (callback) await callback(node, i, node.data === search);
      if (node.data === search) return node;
      if (isSorted) {
        const next = array[i + 1];
        if (next && next.data) {
          const nextData = next.data;
          if (
            (direction === "ascending" && nextData > search) ||
            (direction === "descending" && nextData < search)
          ) {
            return null;
          }
        }
      }
    }

    return null;
  }
  static async binary<T extends Primitive>(
    array: Node<T>[],
    search: T,
    callback: CallbackBinary<T> | null = null,
    direction: Direction = "ascending"  // "ascending" for ascending, "backward" for descending
  ): Promise<Node<T> | null> {
    if (!array.length || search === null) return null;
  
    let start = 0;
    let end = array.length - 1;
  
    while (start <= end) {
      let middle = Math.floor((start + end) / 2);
      const middleNode = array[middle];
      if (callback) await callback(middle, start, end);
      if (!middleNode || middleNode.data === null) break;
  
      if (middleNode.data === search)  return middleNode; 
      if (direction === "ascending") {    
        if (middleNode.data > search) {
          end = middle - 1;
        } else {
          start = middle + 1;
        }
      } else if (direction === "descending") {
        if (middleNode.data < search) {
          end = middle - 1;
        } else {
          start = middle + 1;
        }
      }
    }

    return null
  }
  
}
