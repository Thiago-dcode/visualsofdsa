import Node from "@/entities/data-structures/linear/_classes/Node";
import { ClosureCompare, ClosureSlice } from "../types";
import { Direction } from "@/types";
import { random } from "@/lib/utils";
import MaxStepsError from "@/lib/errors/MaxStepsError";
export class SortAlgorithms {
  private static MAX_STEPS = 70000;
  private static throwMaxStepsError = (steps: number) => {
    if (steps > this.MAX_STEPS) {
      throw new MaxStepsError(`We detected a very inefficient algorithm, Max steps exceeded: ${this.MAX_STEPS}`);
    }
  }
  public static async bubble(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onSwap?: ClosureCompare
  ) {
    if (array.length <= 1) return 1;
    let steps = 0;
    let swapped = false;
    let end = array.length - 1;
    for (let i = 0; i < array.length; i++) {
      swapped = false;
      for (let j = 0; j < end; j++) {
        this.throwMaxStepsError(++steps);
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

    return steps;
  }

  public static async selection(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onSwap?: ClosureCompare
  ) {
    if (array.length <= 1) return 1;
    let steps = 0;

    for (let i = 0; i < array.length; i++) {
      let indexToCompare = i;
      for (let j = i + 1; j < array.length; j++) {
        this.throwMaxStepsError(++steps);
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
    return steps;
  }

  public static async insertion(
    array: Node<number>[],
    direction: Direction = "ascending",
    onCompare?: ClosureCompare,
    onShift?: ClosureCompare
  ) {
    if (array.length <= 1) return 1;
    let steps = 0;
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = i; j >= 0; j--) {
        this.throwMaxStepsError(++steps);
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

    return steps;
  }

  public static async merge(
    array: Node<number>[],
    direction: Direction = "ascending",
    onSlice?: ClosureSlice,
    onMerge?: ClosureCompare
  ) {
    let steps = 0;
    if (array.length <= 1) return 1;
    const _merge = async (
      array: Node<number>[],
      onSlice?: ClosureSlice,
      onMerge?: ClosureCompare
    ) => {
      if (array.length <= 1) return;
      const merge = async (
        leftArray: Node<number>[],
        rightArray: Node<number>[],
        subArray: Node<number>[]
      ) => {
        let i = 0;
        let l = 0;
        let r = 0;

        while (l < leftArray.length || r < rightArray.length) {
          this.throwMaxStepsError(++steps);
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
        this.throwMaxStepsError(++steps);
        if (i < middle) {
          leftArray.push(array[i].clone(true));
        } else {
          rightArray.push(array[i].clone(true));
        }
      }
      if (onSlice) await onSlice(leftArray, "left");
      await _merge(leftArray, onSlice, onMerge);
      if (onSlice) await onSlice(rightArray, "right");
      await _merge(rightArray, onSlice, onMerge);
      await merge(leftArray, rightArray, array);
    };
    await _merge(array, onSlice, onMerge);
    return steps;
  }
  public static async quick(
    array: Node<number>[],
    direction: Direction = "ascending",
    onPivot?: (pivot: Node<number>) => Promise<void>,
    onSwap?: ClosureCompare,
    onCompare?: (start: number, end: number) => Promise<void>
  ) {
    let steps = 0; // Tracks steps
    if (array.length <= 1) return 1;

    const quick = async (startIndex: number, endIndex: number) => {
      this.throwMaxStepsError(++steps);
      if (endIndex <= startIndex) return;

      let i = startIndex - 1;
      const pivot = array[endIndex];
      if (onPivot) await onPivot(pivot);
      if (onCompare) await onCompare(startIndex, endIndex);

      for (let j = startIndex; j < endIndex; j++) {
        this.throwMaxStepsError(++steps);
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
    return steps;
  }
  public static async bogo(
    array: Node<number>[],
    direction: Direction = "ascending",
    onShuffle?: ClosureCompare
  ) {

    let steps = 0;
    const shuffle = async () => {
      for (let i = 0; i < array.length; i++) {
        this.throwMaxStepsError(++steps);
        const randomN = random(0, array.length - 1);
        if (onShuffle) await onShuffle(array[i], array[randomN]);
        const temp = array[i];
        array[i] = array[randomN];
        array[randomN] = temp;
      }
    }
    const isSorted = () => {
      for (let i = 0; i < array.length - 1; i++) {
        if (direction === "ascending" && array[i].data > array[i + 1].data) return false;
        if (direction === "descending" && array[i].data < array[i + 1].data) return false;
      }
      return true;
    }
    while (!isSorted()) {
      await shuffle();
    }
    return steps;
  }

}
