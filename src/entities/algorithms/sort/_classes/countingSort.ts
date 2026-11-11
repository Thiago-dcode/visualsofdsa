import Node from "@/entities/data-structures/linear/_classes/Node";
import MaxStepsError from "@/lib/errors/MaxStepsError";
import { Direction } from "@/types";

const MAX_STEPS = 70000;

const throwMaxStepsError = (steps: number) => {
  if (steps > MAX_STEPS) {
    throw new MaxStepsError(
      `We detected a very inefficient algorithm, Max steps exceeded: ${MAX_STEPS}`,
    );
  }
};

/**
 * Stable counting sort for integers (negatives supported by offsetting with the minimum).
 * Mutates `array` in place and resolves with the number of steps taken
 * (one per counted element, per accumulated count slot and per placed element).
 * Placement walks the input from last to first, which keeps equal values in their original order.
 */
export const countingSort = async (
  array: Node<number>[],
  direction: Direction = "ascending",
  onCount?: (node: Node<number>, countIndex: number, newCount: number) => Promise<void>,
  onPrefix?: (countIndex: number, runningTotal: number) => Promise<void>,
  onPlace?: (slot: Node<number>, source: Node<number>, targetIndex: number) => Promise<void>,
): Promise<number> => {
  if (array.length <= 1) return 1;

  let min = array[0].data;
  let max = array[0].data;
  for (const node of array) {
    if (!Number.isInteger(node.data)) {
      throw new RangeError("Counting sort supports integers");
    }
    if (node.data < min) min = node.data;
    if (node.data > max) max = node.data;
  }

  const range = max - min + 1;
  // Guard before allocating: the count array and the prefix pass cost `range` steps.
  throwMaxStepsError(range + array.length * 2);

  let steps = 0;
  const counts: number[] = new Array(range).fill(0);

  // Phase 1: count occurrences.
  for (const node of array) {
    throwMaxStepsError(++steps);
    const countIndex = node.data - min;
    counts[countIndex]++;
    if (onCount) await onCount(node, countIndex, counts[countIndex]);
  }

  // Phase 2: accumulate. Ascending sums from the lowest value, descending from the highest.
  if (direction === "ascending") {
    for (let i = 0; i < range; i++) {
      throwMaxStepsError(++steps);
      if (i > 0) counts[i] += counts[i - 1];
      if (onPrefix) await onPrefix(i, counts[i]);
    }
  } else {
    for (let i = range - 1; i >= 0; i--) {
      throwMaxStepsError(++steps);
      if (i < range - 1) counts[i] += counts[i + 1];
      if (onPrefix) await onPrefix(i, counts[i]);
    }
  }

  // Phase 3: place from last to first so equal values keep their order.
  // The live array is only written once the loop ends: the UI re-renders while the callbacks run,
  // and swapping nodes (new ids/keys) mid-run would remount bars whose refs are still being animated.
  const sources = array.map((node) => node.clone(true));
  const placed: Node<number>[] = new Array(array.length);
  for (let i = sources.length - 1; i >= 0; i--) {
    throwMaxStepsError(++steps);
    const source = sources[i];
    const countIndex = source.data - min;
    // For descending the running total counts values >= v, so the slot is found the same way.
    counts[countIndex]--;
    const targetIndex = counts[countIndex];
    if (onPlace) await onPlace(array[targetIndex], source, targetIndex);
    placed[targetIndex] = source;
  }
  for (let i = 0; i < placed.length; i++) array[i] = placed[i];

  return steps;
};
