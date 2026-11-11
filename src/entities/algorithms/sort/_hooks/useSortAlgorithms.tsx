import { ReactNode, useState } from "react";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { Direction, speed, VisualizationArrays } from "@/types";
import { AlgoSortType } from "../../types";
import { SortAlgorithms } from "../_classes/SortAlgorithms";
import { ClosureCompare, ClosureSlice } from "../types";
import { useAnimationSort } from "./useAnimationSort";
import { useBucketSort } from "./useBucketSort";
import { useCountingSort } from "./useCountingSort";
import { useRadixSort } from "./useRadixSort";

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
export const useSortAlgorithms = (
  array: Node<number>[],
  speed: speed = 1,
  direction: Direction,
  visualization: VisualizationArrays = "memoryRam",
  maxBarSize?: number,
) => {
  let minArrayValue = 0;
  let maxArrayValue = 0;
  if (array) {
    minArrayValue = getMinInAnArrayOfNodes(array);
    maxArrayValue = getMaxInAnArrayOfNodes(array);
  }
  const animations = useAnimationSort(visualization);
  const { animateNode, animateSound, animateOnSwap, animationOnSlice, animationOnMerge } =
    animations;
  const countingSort = useCountingSort({
    array,
    speed,
    direction,
    visualization,
    animations,
    maxBarSize,
  });
  const radixSort = useRadixSort({
    array,
    speed,
    direction,
    visualization,
    animations,
    maxBarSize,
  });
  const bucketSort = useBucketSort({
    array,
    speed,
    direction,
    visualization,
    animations,
    maxBarSize,
  });
  const [isSorted, setIsSorted] = useState(false);
  const [message, setMessage] = useState<{
    title: string;
    description: ReactNode;
  } | null>(null);

  const comparisionBased = async (type: AlgoSortType) => {
    const allowedTypes: AlgoSortType[] = ["bubble", "insertion", "selection", "bogo"];
    if (!allowedTypes.includes(type)) {
      throw new Error("Not compatible with this algorithm");
    }
    let speedAnimation = getSpeed(speed);
    if (type === "bogo") speedAnimation *= 0.1;
    const onCompare: ClosureCompare = async (nodeA, nodeB) => {
      try {
        if (nodeA.ref && nodeB.ref) {
          animateSound(nodeA.data, minArrayValue, maxArrayValue);
          animateSound(nodeB.data, minArrayValue, maxArrayValue);
          await Promise.all([
            animateNode(nodeA.ref, "search", speedAnimation),
            animateNode(nodeB.ref, type !== "selection" ? "search" : "select", speedAnimation),
          ]);
        }
      } catch (_error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM");
      }
    };
    const onSwap: ClosureCompare = async (nodeA, nodeB) => {
      try {
        animateSound(nodeA.data, minArrayValue, maxArrayValue);
        animateSound(nodeB.data, minArrayValue, maxArrayValue);
        await animateOnSwap(nodeA, nodeB, speedAnimation);
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM", error);
      }
    };
    onSortEnds(
      type === "bogo"
        ? await SortAlgorithms.bogo(array, direction, onSwap)
        : await SortAlgorithms[type as "bubble" | "insertion" | "selection"](
            array,
            direction,
            onCompare,
            onSwap,
          ),
    );
  };

  const bubble = async () => {
    await comparisionBased("bubble");
  };

  const selection = async () => {
    await comparisionBased("selection");
  };
  const insertion = async () => {
    await comparisionBased("insertion");
  };

  const merge = async (maxBarSize: number) => {
    const onSlice: ClosureSlice = async (array) => {
      await animationOnSlice(array, maxBarSize, getSpeed(speed), async (node) => {
        animateSound(node.data, minArrayValue, maxArrayValue);
      });
    };
    const onMerge: ClosureCompare = async (nodeA, nodeB) => {
      animateSound(nodeB.data, minArrayValue, maxArrayValue);
      await animationOnMerge(nodeA, nodeB, getSpeed(speed));
    };

    onSortEnds(await SortAlgorithms.merge(array as Node<number>[], direction, onSlice, onMerge));
  };

  const quick = async () => {
    const onPivot = async (pivot: Node<number>) => {
      if (pivot.ref) pivot.ref.style.backgroundColor = "red";
    };
    const onCompare = async (start: number, end: number) => {
      const animationPromises: Promise<void>[] = [];
      for (let i = start; i < end; i++) {
        const element = array[i];
        if (!element?.ref) continue;
        if (visualization === "memoryRam") element.ref.style.backgroundColor = "";
        animationPromises.push(animateNode(element.ref, "search", getSpeed(speed)));
      }
      await Promise.all(animationPromises);
    };
    const onSwap: ClosureCompare = async (nodeA, nodeB) => {
      animateSound(nodeA.data, minArrayValue, maxArrayValue);
      animateSound(nodeB.data, minArrayValue, maxArrayValue);

      await animateOnSwap(nodeA, nodeB, getSpeed(speed));
    };
    onSortEnds(
      await SortAlgorithms.quick(array as Node<number>[], direction, onPivot, onSwap, onCompare),
    );
  };
  const bogo = async () => {
    await comparisionBased("bogo");
  };
  // Resolves false when the run was aborted (page left / array reset): nothing to report then.
  const counting = async () => {
    const steps = await countingSort.run();
    if (steps === 0) return false;
    onSortEnds(steps);
    return true;
  };
  // Resolves false when the run was aborted (page left / array reset): nothing to report then.
  const radix = async () => {
    const steps = await radixSort.run();
    if (steps === 0) return false;
    onSortEnds(steps);
    return true;
  };
  // Resolves false when the run was aborted (page left / array reset): nothing to report then.
  const bucket = async () => {
    const steps = await bucketSort.run();
    if (steps === 0) return false;
    onSortEnds(steps);
    return true;
  };
  const resetAux = () => {
    countingSort.reset();
    radixSort.reset();
    bucketSort.reset();
  };
  const onSortEnds = (steps: number) => {
    setMessage({
      title: "STEPS TAKEN",
      description: (
        <>
          Took <strong>{steps} steps</strong> to sort an array of size {array?.length}
        </>
      ),
    });
    setIsSorted(true);
  };
  const setUnsorted = () => {
    setIsSorted(false);
  };
  const clearMessage = () => {
    setMessage(null);
  };

  return {
    bubble,
    selection,
    merge,
    quick,
    bogo,
    insertion,
    counting,
    radix,
    bucket,
    countingAux: countingSort.aux,
    radixAux: radixSort.aux,
    bucketAux: bucketSort.aux,
    announcement: {
      counting: countingSort.announcement,
      radix: radixSort.announcement,
      bucket: bucketSort.announcement,
    },
    resetAux,
    message,
    isSorted,
    clearMessage,
    setUnsorted,
  };
};
