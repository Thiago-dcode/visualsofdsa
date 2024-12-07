import Node from "@/entities/data-structures/linear/_classes/Node";
import { ClosureCompare } from "../types";
import { Direction } from "@/types";

export class SortAlgorithms {
  public static async bubble(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onSwap?: ClosureCompare
  ) {
    if (array.length <= 1) return array;
    let swapped = false;
    let end = array.length - 1;
    for (let i = 0; i < array.length; i++) {
      swapped = false;
      for (let j = 0; j < end; j++) {
        const temp = array[j + 1];
        if (onCompare) await onCompare(array[j], array[j + 1]);
        if (
          (direction === "ascending" && array[j].data > temp.data) ||
          (direction === "descending" && array[j].data < temp.data)
        ) {
          if (onSwap) await onSwap(array[j], array[j + 1]);
          swapped = true;
          array[j + 1] = array[j];
          array[j] = temp;
        }
      }
      if (!swapped) break;
      end--;
    }

    return array;
  }

  public static async selection(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onSwap?: ClosureCompare
  ): Promise<Node<number>[]> {
    if (array.length <= 1) return array;
    for (let i = 0; i < array.length; i++) {
      let indexToCompare = i;
      for (let j = i + 1; j < array.length; j++) {
        if (onCompare) await onCompare(array[j], array[indexToCompare]);
        if (
          (direction === "ascending" &&
            array[j].data < array[indexToCompare].data) ||
          (direction === "descending" &&
            array[j].data > array[indexToCompare].data)
        ) {
          indexToCompare = j;
        }
      }
      if (i !== indexToCompare) {
        if (onSwap) await onSwap(array[i], array[indexToCompare]);
        const temp = array[i];
        array[i] = array[indexToCompare];
        array[indexToCompare] = temp;
      }
    }
    return array;
  }
}
