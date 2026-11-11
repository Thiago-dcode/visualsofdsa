import { useRef, useState } from "react";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { Direction, speed, VisualizationArrays } from "@/types";
import { radixSort } from "../_classes/radixSort";
import { DEFAULT_MAX_BAR_SIZE, lowerToAuxRow, settle } from "./lowerToAuxRow";
import { useAnimationSort } from "./useAnimationSort";
import { isAudible, RunAborted, useRunGuard } from "./useRunGuard";

export type RadixPhase = "idle" | "distribute" | "collect" | "done";

export type RadixAux = {
  /** Values currently held by each digit bucket 0-9. */
  buckets: number[][];
  /** Zero based exponent of the digit being sorted (0 = ones, 1 = tens, ...). */
  digitPosition: number;
  totalPasses: number;
  /** Bucket (digit) touched by the last element, or null. */
  active: number | null;
  phase: RadixPhase;
};

type UseRadixSortParams = {
  array: Node<number>[];
  speed: speed;
  direction: Direction;
  visualization: VisualizationArrays;
  animations: ReturnType<typeof useAnimationSort>;
  /** Height of the bar area, used to drop the bars to the row below before collecting them. */
  maxBarSize?: number;
};

const BASE = 10;

const emptyBuckets = (): number[][] => Array.from({ length: BASE }, () => []);

const initialAux = (): RadixAux => ({
  buckets: emptyBuckets(),
  digitPosition: 0,
  totalPasses: 0,
  active: null,
  phase: "idle",
});

const getSpeed = (speed: number) => {
  switch (speed) {
    case 1:
      return 0.3;
    case 2:
      return 0.15;
    case 3:
      return 0.07;
    case 4:
      return 0.015;
  }
  return 0.1;
};

export const getDigitName = (digitPosition: number) => {
  switch (digitPosition) {
    case 0:
      return "ones";
    case 1:
      return "tens";
    case 2:
      return "hundreds";
    case 3:
      return "thousands";
    default:
      return `10^${digitPosition}`;
  }
};

export const useRadixSort = ({
  array,
  speed,
  direction,
  animations,
  maxBarSize = DEFAULT_MAX_BAR_SIZE,
}: UseRadixSortParams) => {
  const { animateNode, animateSound, animationOnMerge } = animations;
  const [aux, setAux] = useState<RadixAux>(initialAux);
  const [announcement, setAnnouncement] = useState("");
  // Mutable mirror of the buckets so callbacks never read stale state.
  const bucketsRef = useRef<number[][]>(emptyBuckets());

  const guard = useRunGuard();

  const reset = () => {
    guard.abort();
    bucketsRef.current = emptyBuckets();
    setAux(initialAux());
    setAnnouncement("");
  };

  const run = async (): Promise<number> => {
    const check = guard.begin();
    const minValue = array.length ? getMinInAnArrayOfNodes(array) : 0;
    const maxValue = array.length ? getMaxInAnArrayOfNodes(array) : 0;
    const stepSpeed = getSpeed(speed);
    bucketsRef.current = emptyBuckets();
    let alignSource: ((source: Node<number>) => void) | null = null;
    // Mirrors the order the class is working on; the live array is only written when sorting ends.
    let working = array.slice();
    let collected: Node<number>[] = [];

    const onPass = async (digitPosition: number, totalPasses: number) => {
      check();
      alignSource = null;
      if (collected.length > 0) working = collected;
      collected = [];
      bucketsRef.current = emptyBuckets();
      setAux({
        buckets: emptyBuckets(),
        digitPosition,
        totalPasses,
        active: null,
        phase: "distribute",
      });
      setAnnouncement(
        `Pass ${digitPosition + 1} of ${totalPasses}: sorting by the ${getDigitName(digitPosition)} digit`,
      );
    };

    const onDistribute = async (node: Node<number>, digit: number) => {
      check();
      bucketsRef.current[digit].push(node.data);
      setAux((prev) => ({
        ...prev,
        buckets: bucketsRef.current.map((bucket) => [...bucket]),
        active: digit,
        phase: "distribute",
      }));
      if (isAudible(node)) animateSound(node.data, minValue, maxValue);
      const ref = node.ref;
      if (ref) await settle(ref, stepSpeed, () => animateNode(ref, "search", stepSpeed));
    };

    const onCollect = async (slot: Node<number>, source: Node<number>, _targetIndex: number) => {
      check();
      // The collected element always leaves the first non-empty bucket in collect order.
      const order = Array.from({ length: BASE }, (_, i) => (direction === "ascending" ? i : 9 - i));
      const digit = order.find((d) => bucketsRef.current[d].length > 0) ?? null;
      if (digit !== null) bucketsRef.current[digit].shift();
      setAux((prev) => ({
        ...prev,
        buckets: bucketsRef.current.map((bucket) => [...bucket]),
        active: digit,
        phase: "collect",
      }));
      if (isAudible(source)) animateSound(source.data, minValue, maxValue);
      // Like merge sort: drop every bar to the row below once per pass, then raise them in order.
      if (!alignSource) {
        alignSource = await lowerToAuxRow(working, animations, maxBarSize, stepSpeed);
      }
      check();
      alignSource(source);
      collected.push(source);
      await settle(source.ref, stepSpeed, () => animationOnMerge(slot, source, stepSpeed));
    };

    try {
      const steps = await radixSort(array, direction, onPass, onDistribute, onCollect);
      check();
      setAux((prev) => ({ ...prev, active: null, phase: "done" }));
      setAnnouncement(`Radix sort finished in ${steps} steps`);
      return steps;
    } catch (error) {
      if (error instanceof RunAborted) return 0;
      bucketsRef.current = emptyBuckets();
      setAux(initialAux());
      throw error;
    }
  };

  return { run, aux, announcement, reset };
};

export default useRadixSort;
