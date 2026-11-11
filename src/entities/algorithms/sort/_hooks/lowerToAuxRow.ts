import Node from "@/entities/data-structures/linear/_classes/Node";
import { useAnimationSort } from "./useAnimationSort";

export const DEFAULT_MAX_BAR_SIZE = 650;

/**
 * Awaits an animation but never forever: `animate()` only resolves on `animationend`, which never
 * fires for a detached or hidden element. A one-shot timeout lets the sort carry on regardless.
 */
export const settle = async (
  ref: HTMLElement | null | undefined,
  seconds: number,
  run: () => Promise<unknown>,
) => {
  if (ref && !ref.isConnected) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, seconds * 1000 * 2 + 1500);
  });
  try {
    await Promise.race([run(), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

/**
 * Same idea as merge sort's slice step: before values are written back into the array, every
 * bar drops to a row below the array. The top row is then empty and each bar rises into its final
 * slot, so no bar ever overlaps another and no slot looks half empty.
 *
 * `animationOnSlice` mutates the positions of the nodes it receives, so it gets throwaway clones
 * (sharing the refs). The returned function copies the lowered position onto a write-back source
 * so `animationOnMerge` starts the move from where the bar really is.
 */
export const lowerToAuxRow = async (
  array: Node<number>[],
  animations: ReturnType<typeof useAnimationSort>,
  maxBarSize: number,
  seconds: number,
  onNode?: (node: Node<number>) => void,
) => {
  const clones = array.map((node) => node.clone(true));
  await settle(null, seconds, () =>
    animations.animationOnSlice(clones, maxBarSize, seconds, async (node) => {
      if (onNode) onNode(node);
    }),
  );
  const byRef = new Map<HTMLElement, Node<number>>();
  for (const clone of clones) if (clone.ref) byRef.set(clone.ref, clone);

  return (source: Node<number>) => {
    const lowered = source.ref ? byRef.get(source.ref) : undefined;
    if (!lowered) return;
    source.position.x = lowered.position.x;
    source.position.y = lowered.position.y;
  };
};

/** One-shot pause so React can paint a phase change and the user can read it. */
export const pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
