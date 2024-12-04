import Node from "@/entities/data-structures/linear/_classes/Node";

type Closure = (a: Node<number>, b: Node<number>) => Promise<void>;
export class SortAlgorithms {
  public static async bubble(
    array: Node<number>[],
    onCompare?: Closure,
    onSwap?: Closure
  ) {
    if (!array.length) return array;
    let swapped = false;
    let end = array.length - 1;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < end; j++) {
        const temp = array[j + 1];
        if (onCompare) await onCompare(array[j], array[j + 1]);
        if (array[j].data > temp.data) {
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
    onCompare?: Closure,
    onSwap?: Closure
  ): Promise<Node<number>[]> {
    for (let i = 0; i < array.length; i++) {
      let lowestIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (onCompare) await onCompare(array[j], array[lowestIndex]);
        if (array[j].data < array[lowestIndex].data) {
          lowestIndex = j;
        }
      }
      if (i !== lowestIndex) {
        if (onSwap) await onSwap(array[i], array[lowestIndex]);
        const temp = array[i];
        array[i] = array[lowestIndex];
        array[lowestIndex] = temp;
      }
    }
    return array;
  }
}
