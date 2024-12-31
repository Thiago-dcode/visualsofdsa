import Node from "@/entities/data-structures/linear/_classes/Node";
import { ClosureCompare, ClosureSlice } from "../types";
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

  public static async insertion(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onShift?: ClosureCompare
  ) {
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i; j >= 0; j--) {
        const temp = array[j + 1];
        const left = array[j];
        if (onCompare) await onCompare(array[j], array[j + 1]);
        if (
          (direction === "ascending" && left.data < temp.data) ||
          (direction === "descending" && left.data > temp.data)
        )
          break;
        if (onShift) await onShift(array[j], array[j + 1]);
        array[j + 1] = array[j];
        array[j] = temp;
      }
    }

    return array;
  }

  public static async merge(
    array: Node<number>[],
    direction: Direction = "ascending",
    onSlice?: ClosureSlice,
    onMerge?: ClosureCompare,
    onLoop?: () => Promise<void>
  ): Promise<Node<number>[]> {
    if (array.length <= 1) return array;
    const merge = async (
      leftArray: Node<number>[],
      rightArray: Node<number>[],
      subArray: Node<number>[]
    ) => {
      let i = 0;
      let l = 0;
      let r = 0;

      while (l < leftArray.length || r < rightArray.length) {
        if (onLoop) await onLoop();
        const leftNode = leftArray[l];
        const rightNode = rightArray[r];
        if (
          !rightNode ||
          (leftNode &&
            ((direction === "ascending" && leftNode.data < rightNode.data) ||
              (direction === "descending" && leftNode.data > rightNode.data)))
        ) {
          if (onMerge) await onMerge(subArray[i], leftNode);
          l++;
          subArray[i] = leftNode;
        } else {
          if (onMerge) await onMerge(subArray[i], rightNode);
          r++;
          subArray[i] = rightNode;
        }
        i++;
      }
    };
    const leftArray: Node<number>[] = [];
    const rightArray: Node<number>[] = [];
    const middle = Math.floor(array.length / 2);
    for (let i = 0; i < array.length; i++) {
      if (onLoop) await onLoop();
      if (i < middle) {
        leftArray.push(array[i].clone(true));
      } else {
        rightArray.push(array[i].clone(true));
      }
    }
    if (onSlice) await onSlice(leftArray, "left");
    await this.merge(leftArray, direction, onSlice, onMerge);
    if (onSlice) await onSlice(rightArray, "right");
    await this.merge(rightArray, direction, onSlice, onMerge);
    await merge(leftArray, rightArray, array);
    return array;
  }
  public static async quick(
    array: Node<number>[],
    direction: Direction = "ascending",
    onPivot?: (pivot: Node<number>) => Promise<void>,
    onSwap?: ClosureCompare,
    onCompare?: ClosureCompare
  ) {
    const quick = async (startIndex: number, endIndex: number) => {
      if (endIndex <= startIndex) return;
      let i = startIndex - 1;
      const pivot = array[endIndex];
      if (onPivot) await onPivot(pivot);
      for (let j = startIndex; j < endIndex; j++) {
        if (onCompare) await onCompare (array[i], array[j]);
        if (
          (direction === "ascending" && array[j].data < pivot.data) ||
          (direction === "descending" && array[j].data > pivot.data)
        ) {
          i++;
          if (onSwap) await onSwap(array[i], array[j]);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
      i++;
      if (onSwap) await onSwap(array[i], array[endIndex]);
      const temp = array[i];
      array[i] = array[endIndex];
      array[endIndex] = temp;
      await quick(startIndex, i - 1);
      await quick(i + 1, endIndex);
    };
    await quick(0, array.length - 1);
    return array;
  }
}
