import { useCallback, useState } from "react";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { Direction, speed, VisualizationArrays } from "@/types";
import { countingSort } from "../_classes/countingSort";
import { DEFAULT_MAX_BAR_SIZE, lowerToAuxRow, pause, settle } from "./lowerToAuxRow";
import { useAnimationSort } from "./useAnimationSort";
import { isAudible, RunAborted, useRunGuard } from "./useRunGuard";

export type CountingPhase = "idle" | "count" | "prefix" | "place" | "done";

export type CountingAux = {
  min: number;
  counts: number[];
  /** Distinct values present in the array (ascending). The panel only draws these cells. */
  values: number[];
  active: number | null;
  phase: CountingPhase;
};

const MAX_DISPLAYED_COUNTS = 70000;

const INITIAL_AUX: CountingAux = { min: 0, counts: [], values: [], active: null, phase: "idle" };

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

type Params = {
  array: Node<number>[];
  speed: speed;
  direction: Direction;
  visualization: VisualizationArrays;
  animations: ReturnType<typeof useAnimationSort>;
  /** Height of the bar area, used to drop the bars to the row below before placing them. */
  maxBarSize?: number;
};

export const useCountingSort = ({
  array,
  speed,
  direction,
  animations,
  maxBarSize = DEFAULT_MAX_BAR_SIZE,
}: Params) => {
  const { animateNode, animateSound, animationOnMerge } = animations;
  const [aux, setAux] = useState<CountingAux>(INITIAL_AUX);
  const [announcement, setAnnouncement] = useState("");

  const guard = useRunGuard();
  const { abort } = guard;

  const reset = useCallback(() => {
    abort();
    setAux(INITIAL_AUX);
    setAnnouncement("");
  }, [abort]);

  const run = async () => {
    const check = guard.begin();
    const animationSpeed = getSpeed(speed);
    const minValue = array.length ? getMinInAnArrayOfNodes(array) : 0;
    const maxValue = array.length ? getMaxInAnArrayOfNodes(array) : 0;
    const range = maxValue - minValue + 1;
    // Only mirror the counts on screen when the range is renderable; the class throws otherwise.
    const initialCounts = range <= MAX_DISPLAYED_COUNTS ? new Array<number>(range).fill(0) : [];
    const values = Array.from(new Set(array.map((node) => node.data))).sort((a, b) => a - b);
    let phase: CountingPhase = "count";
    let alignSource: ((source: Node<number>) => void) | null = null;

    setAux({
      min: minValue,
      counts: initialCounts,
      values: range <= MAX_DISPLAYED_COUNTS ? values : [],
      active: null,
      phase,
    });
    setAnnouncement("Counting: tallying how many times each value appears");

    const changePhase = (next: CountingPhase, message: string) => {
      if (phase === next) return;
      phase = next;
      setAnnouncement(message);
    };

    const onCount = async (node: Node<number>, countIndex: number, newCount: number) => {
      check();
      setAux((prev) => {
        const counts = prev.counts.slice();
        counts[countIndex] = newCount;
        return { ...prev, counts, active: countIndex, phase: "count" };
      });
      if (isAudible(node)) animateSound(node.data, minValue, maxValue);
      const ref = node.ref;
      if (ref) await settle(ref, animationSpeed, () => animateNode(ref, "search", animationSpeed));
    };

    // Accumulating has no bars to animate, so it gets short awaited pauses instead. The first one
    // lets "Accumulating" render and hold; later ones are spread so the total stays bounded.
    const stride = Math.max(1, Math.ceil(range / 8));
    let prefixCalls = 0;
    const onPrefix = async (countIndex: number, runningTotal: number) => {
      check();
      changePhase("prefix", "Accumulating: turning counts into final positions");
      setAux((prev) => {
        const counts = prev.counts.slice();
        counts[countIndex] = runningTotal;
        return { ...prev, counts, active: countIndex, phase: "prefix" };
      });
      if (prefixCalls === 0) await pause(Math.max(200, animationSpeed * 1000));
      else if (prefixCalls % stride === 0) await pause(Math.max(16, animationSpeed * 500));
      check();
      prefixCalls++;
    };

    const onPlace = async (slot: Node<number>, source: Node<number>, _targetIndex: number) => {
      check();
      changePhase("place", "Placing: moving each value to its final position");
      // Like merge sort: drop every bar to the row below once, then raise them into their slots.
      if (!alignSource) {
        alignSource = await lowerToAuxRow(array, animations, maxBarSize, animationSpeed);
      }
      check();
      alignSource(source);
      const countIndex = source.data - minValue;
      setAux((prev) => {
        const counts = prev.counts.slice();
        counts[countIndex] = Math.max(0, (counts[countIndex] ?? 0) - 1);
        return { ...prev, counts, active: countIndex, phase: "place" };
      });
      if (isAudible(source)) animateSound(source.data, minValue, maxValue);
      await settle(source.ref, animationSpeed, () =>
        animationOnMerge(slot, source, animationSpeed),
      );
    };

    try {
      const steps = await countingSort(array, direction, onCount, onPrefix, onPlace);
      check();
      setAux((prev) => ({ ...prev, active: null, phase: "done" }));
      setAnnouncement(`Sorted ${array.length} numbers with counting sort`);
      return steps;
    } catch (error) {
      // A stale run (page left, array reset) ends quietly; 0 tells the caller it was aborted.
      if (error instanceof RunAborted) return 0;
      reset();
      throw error;
    }
  };

  return { run, aux, announcement, reset };
};
