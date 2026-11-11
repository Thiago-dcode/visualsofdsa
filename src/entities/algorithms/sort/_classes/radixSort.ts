import Node from "@/entities/data-structures/linear/_classes/Node";
import MaxStepsError from "@/lib/errors/MaxStepsError";
import { Direction } from "@/types";

const MAX_STEPS = 70000;
const BASE = 10;

const throwMaxStepsError = (steps: number) => {
  if (steps > MAX_STEPS) {
    throw new MaxStepsError(
      `We detected a very inefficient algorithm, Max steps exceeded: ${MAX_STEPS}`,
    );
  }
};

/**
 * LSD radix sort, base 10. Stable on every digit pass.
 * Non-negative integers only.
 *
 * Steps: one per element on every distribute and collect, so passes * n * 2.
 *
 * Write-back follows the merge pattern: sources are clones that keep the `ref`,
 * destinations are the live array slots.
 */
export const radixSort = async (
  array: Node<number>[],
  direction: Direction = "ascending",
  onPass?: (digitPosition: number, totalPasses: number) => Promise<void>,
  onDistribute?: (node: Node<number>, digit: number) => Promise<void>,
  onCollect?: (slot: Node<number>, source: Node<number>, targetIndex: number) => Promise<void>,
): Promise<number> => {
  for (const node of array) {
    if (!Number.isInteger(node.data) || node.data < 0) {
      throw new RangeError("Radix sort supports non-negative integers");
    }
  }
  if (array.length <= 1) return 1;

  let max = 0;
  for (const node of array) if (node.data > max) max = node.data;
  const totalPasses = String(max).length;

  let steps = 0;
  const digitOrder = Array.from({ length: BASE }, (_, i) =>
    direction === "ascending" ? i : BASE - 1 - i,
  );

  // The live array is only written once every pass is done: the UI re-renders while the callbacks
  // run, and swapping nodes (new ids/keys) mid-run would remount bars still being animated.
  let current = array.slice();
  for (let pass = 0; pass < totalPasses; pass++) {
    if (onPass) await onPass(pass, totalPasses);
    const divisor = BASE ** pass;
    const sources = current.map((node) => node.clone(true));
    const buckets: Node<number>[][] = Array.from({ length: BASE }, () => []);

    for (const source of sources) {
      throwMaxStepsError(++steps);
      const digit = Math.floor(source.data / divisor) % BASE;
      if (onDistribute) await onDistribute(source, digit);
      buckets[digit].push(source);
    }

    const next: Node<number>[] = [];
    for (const digit of digitOrder) {
      for (const source of buckets[digit]) {
        throwMaxStepsError(++steps);
        if (onCollect) await onCollect(current[next.length], source, next.length);
        next.push(source);
      }
    }
    current = next;
  }
  for (let i = 0; i < current.length; i++) array[i] = current[i];

  return steps;
};

export default radixSort;
