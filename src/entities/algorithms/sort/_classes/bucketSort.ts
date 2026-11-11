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
 * Bucket sort. Scatters the elements into ceil(sqrt(n)) buckets by value range, sorts every
 * bucket with a stable insertion sort and gathers the buckets back into the array.
 * Returns the number of steps taken (scatter + insertion sort comparisons + gather).
 */
export const bucketSort = async (
  array: Node<number>[],
  direction: Direction = "ascending",
  onScatter?: (node: Node<number>, bucketIndex: number, bucketCount: number) => Promise<void>,
  onBucketSort?: (bucketIndex: number, nodes: Node<number>[]) => Promise<void>,
  onGather?: (slot: Node<number>, source: Node<number>, targetIndex: number) => Promise<void>,
): Promise<number> => {
  if (array.length <= 1) return 1;
  if (array.some((node) => !Number.isFinite(node.data))) {
    throw new RangeError("Bucket sort supports finite numbers");
  }

  let steps = 0;
  const bucketCount = Math.max(1, Math.ceil(Math.sqrt(array.length)));
  let min = array[0].data;
  let max = array[0].data;
  for (const node of array) {
    if (node.data < min) min = node.data;
    if (node.data > max) max = node.data;
  }
  const range = max - min + 1;

  // Sources keep the refs of the live slots (same pattern as merge sort).
  const sources = array.map((node) => node.clone(true));
  const buckets: Node<number>[][] = Array.from({ length: bucketCount }, () => []);

  for (const node of sources) {
    throwMaxStepsError(++steps);
    const raw = Math.floor(((node.data - min) / range) * bucketCount);
    const index = Math.max(0, Math.min(bucketCount - 1, raw));
    buckets[index].push(node);
    if (onScatter) await onScatter(node, index, bucketCount);
  }

  for (let b = 0; b < bucketCount; b++) {
    const bucket = buckets[b];
    if (bucket.length === 0) continue;
    // Stable insertion sort: only move past strictly greater (or smaller when descending).
    for (let i = 1; i < bucket.length; i++) {
      const current = bucket[i];
      let j = i - 1;
      while (j >= 0) {
        throwMaxStepsError(++steps);
        const previous = bucket[j];
        const mustMove =
          direction === "ascending" ? previous.data > current.data : previous.data < current.data;
        if (!mustMove) break;
        bucket[j + 1] = previous;
        j--;
      }
      bucket[j + 1] = current;
    }
    if (onBucketSort) await onBucketSort(b, bucket);
  }

  const order = Array.from({ length: bucketCount }, (_, i) => i);
  if (direction === "descending") order.reverse();
  // The live array is only written once the gather ends: the UI re-renders while the callbacks
  // run, and swapping nodes (new ids/keys) mid-run would remount bars still being animated.
  const gathered: Node<number>[] = [];
  for (const b of order) {
    for (const source of buckets[b]) {
      throwMaxStepsError(++steps);
      if (onGather) await onGather(array[gathered.length], source, gathered.length);
      gathered.push(source);
    }
  }
  for (let i = 0; i < gathered.length; i++) array[i] = gathered[i];

  return steps;
};
