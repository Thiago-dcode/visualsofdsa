import { useState } from "react";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { Direction, speed, VisualizationArrays } from "@/types";
import { bucketSort } from "../_classes/bucketSort";
import { DEFAULT_MAX_BAR_SIZE, lowerToAuxRow, settle } from "./lowerToAuxRow";
import { useAnimationSort } from "./useAnimationSort";
import { isAudible, RunAborted, useRunGuard } from "./useRunGuard";

export type BucketPhase = "idle" | "scatter" | "sort" | "gather" | "done";

export type BucketAux = {
  buckets: number[][];
  active: number | null;
  phase: BucketPhase;
  /** Smallest value of the current run, used by the panel to label bucket ranges. */
  min: number;
  /** Largest value of the current run, used by the panel to label bucket ranges. */
  max: number;
};

const INITIAL_AUX: BucketAux = { buckets: [], active: null, phase: "idle", min: 0, max: 0 };

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

type Props = {
  array: Node<number>[];
  speed: speed;
  direction: Direction;
  visualization: VisualizationArrays;
  animations: ReturnType<typeof useAnimationSort>;
  /** Height of the bar area, used to drop the bars to the row below before gathering them. */
  maxBarSize?: number;
};

export const useBucketSort = ({
  array,
  speed,
  direction,
  visualization,
  animations,
  maxBarSize = DEFAULT_MAX_BAR_SIZE,
}: Props) => {
  const { animateNode, animateSound, animationOnMerge } = animations;
  const [aux, setAux] = useState<BucketAux>(INITIAL_AUX);
  const [announcement, setAnnouncement] = useState("");

  const guard = useRunGuard();

  const reset = () => {
    guard.abort();
    setAux(INITIAL_AUX);
    setAnnouncement("");
  };

  const run = async () => {
    const check = guard.begin();
    const seconds = getSpeed(speed);
    const minValue = array.length ? getMinInAnArrayOfNodes(array) : 0;
    const maxValue = array.length ? getMaxInAnArrayOfNodes(array) : 0;
    let phase: BucketPhase = "idle";
    let local: number[][] = [];
    let alignSource: ((source: Node<number>) => void) | null = null;
    setAux({ ...INITIAL_AUX, min: minValue, max: maxValue });
    setAnnouncement("Bucket sort started");

    const enter = (next: BucketPhase, message: string) => {
      if (phase === next) return;
      phase = next;
      setAnnouncement(message);
    };

    const onScatter = async (node: Node<number>, bucketIndex: number, bucketCount: number) => {
      check();
      enter("scatter", "Scattering elements into buckets");
      if (local.length !== bucketCount) local = Array.from({ length: bucketCount }, () => []);
      local[bucketIndex].push(node.data);
      setAux({
        buckets: local.map((b) => [...b]),
        active: bucketIndex,
        phase: "scatter",
        min: minValue,
        max: maxValue,
      });
      if (isAudible(node)) animateSound(node.data, minValue, maxValue);
      const ref = node.ref;
      if (ref) await settle(ref, seconds, () => animateNode(ref, "search", seconds));
    };

    const onBucketSort = async (bucketIndex: number, nodes: Node<number>[]) => {
      check();
      enter("sort", "Sorting buckets");
      local[bucketIndex] = nodes.map((n) => n.data);
      setAux({
        buckets: local.map((b) => [...b]),
        active: bucketIndex,
        phase: "sort",
        min: minValue,
        max: maxValue,
      });
      await Promise.all(
        nodes.map((n) => {
          if (isAudible(n)) animateSound(n.data, minValue, maxValue);
          const ref = n.ref;
          return ref
            ? settle(ref, seconds, () => animateNode(ref, "select", seconds))
            : Promise.resolve();
        }),
      );
    };

    const onGather = async (slot: Node<number>, source: Node<number>) => {
      check();
      enter("gather", "Gathering buckets into the array");
      // Buckets are consumed in gather order: low to high, or high to low when descending.
      const indexes = local.map((_, i) => i);
      if (direction === "descending") indexes.reverse();
      const current = indexes.find((i) => local[i].length > 0) ?? null;
      if (current !== null) local[current].shift();
      setAux({
        buckets: local.map((b) => [...b]),
        active: current,
        phase: "gather",
        min: minValue,
        max: maxValue,
      });
      if (isAudible(source)) animateSound(source.data, minValue, maxValue);
      // Like merge sort: drop every bar to the row below once, then raise them in bucket order.
      if (!alignSource) {
        alignSource = await lowerToAuxRow(array, animations, maxBarSize, seconds);
      }
      check();
      alignSource(source);
      await settle(source.ref, seconds, () => animationOnMerge(slot, source, seconds));
    };

    try {
      const steps = await bucketSort(array, direction, onScatter, onBucketSort, onGather);
      check();
      setAux({
        buckets: local.map((b) => [...b]),
        active: null,
        phase: "done",
        min: minValue,
        max: maxValue,
      });
      setAnnouncement(`Bucket sort complete in ${steps} steps`);
      return steps;
    } catch (error) {
      if (error instanceof RunAborted) return 0;
      setAux(INITIAL_AUX);
      setAnnouncement("");
      throw error;
    }
  };

  // `visualization` is part of the public contract (callers pass the active mode); the animation
  // helpers already read it from `animations`.
  void visualization;

  return { run, aux, announcement, reset };
};
