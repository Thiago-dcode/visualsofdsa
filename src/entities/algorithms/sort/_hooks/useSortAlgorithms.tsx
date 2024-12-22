import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, speed, VisualizationArrays } from "@/types";
import { SortAlgorithms } from "../_classes/SortAlgorithms";
import { ClosureCompare, ClosureSlice } from "../types";
import { ReactNode, useEffect, useRef, useState } from "react";

import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { useAnimationSort } from "./useAnimationSort";
import { AlgoSortType } from "../../types";
import { toast } from "sonner";
const getSpeed = (type: AlgoSortType, speed: number) => {

  switch (speed) {
    case 1:
      switch (type) {
        case "bubble":
          return 0.275;
        case "selection":
          return 0.325;
        case "insertion":
          return 0.35;
        case "merge":
          return 0.7;
        default:
          0.3;
      }
    case 2:
      switch (type) {
        case "bubble":
          return 0.175;
        case "selection":
          return 0.225;
        case "insertion":
          return 0.275;
        case "merge":
          return 0.4;
        default:
          0.2;
      }
    case 3:
      switch (type) {
        case "bubble":
          return 0.05;
        case "selection":
          return 0.06;
        case "insertion":
          return 0.08;
        case "merge":
          return 0.2;
        default:
          0.1;
      }
  }
  return 0.2;
};
export const useSortAlgorithms = (
  array: Node<number>[],
  speed: speed = 1,
  direction: Direction,
  visualization: VisualizationArrays = "memoryRam",
) => {
  let minArrayValue = 0;
  let maxArrayValue = 0;
  if (array) {
    minArrayValue = getMinInAnArrayOfNodes(array);
    maxArrayValue = getMaxInAnArrayOfNodes(array);
  }
  const { animateNode, animateSound, animateOnSwap, animationOnSlice, animationOnMerge } =
    useAnimationSort(visualization);
  const [isSorted, setIsSorted] = useState(false);
  const [message, setMessage] = useState<{
    title: string,
    description: ReactNode,
  } | null>(null)
  const steps = useRef(0);

  const comparisionBased = async (type: AlgoSortType) => {
    const onCompare: ClosureCompare = async (nodeA, nodeB) => {
      steps.current++;
      try {
        if (nodeA.ref && nodeB.ref) {
          animateSound(nodeA.data, minArrayValue, maxArrayValue);
          if (type !== 'bubble') animateSound(nodeB.data, minArrayValue, maxArrayValue);
          await Promise.all([
            animateNode(nodeA.ref, 'search', getSpeed(type, speed)),
            animateNode(nodeB.ref, type !== 'selection' ? "search" : 'select', getSpeed(type, speed)),
          ]);
        }
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM");
      }
    };
    const onSwap: ClosureCompare = async (nodeA, nodeB) => {
      try {
        animateSound(nodeA.data, minArrayValue, maxArrayValue);
        animateSound(nodeB.data, minArrayValue, maxArrayValue);
        await animateOnSwap(
          nodeA,
          nodeB,
          getSpeed(type, speed)
        );
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM", error);
      }
    };
    switch (type) {
      case 'bubble':
        await SortAlgorithms.bubble(array, direction, onCompare, onSwap);
        break;
      case 'selection':
        await SortAlgorithms.selection(array, direction, onCompare, onSwap);
      case 'insertion':
        await SortAlgorithms.insertion(array, direction, onCompare, onSwap);
        break;
    }

    setIsSorted(true);
  }
  const bubble = async () => {

    await comparisionBased('bubble');

  };

  const selection = async () => {

    await comparisionBased('selection');
  };
  const insertion = async () => {

    await comparisionBased('insertion');
  };

  const merge = async (maxBarSize: number) => {
    const onSlice: ClosureSlice = async (array) => {
      steps.current += array.length

      await animationOnSlice(array, maxBarSize, getSpeed('merge', speed));

    }
    const onMerge: ClosureCompare = async (nodeA, nodeB) => {
      steps.current++;
      await animationOnMerge(nodeA, nodeB, getSpeed('merge', speed));

    }
    // setArrayClone(array as Node<number>[]);
    await SortAlgorithms.merge(array as Node<number>[], direction, onSlice, onMerge)
    setIsSorted(true);
  }

  const setUnsorted = () => {
    setIsSorted(false);
  };
  const clearMessage = () => {
    setMessage(null);
  }
  useEffect(() => {
    if (!isSorted) {
      steps.current = 0;
      setMessage(null)
    } else {
      setMessage({
        title: 'STEPS TAKEN',
        description: <p>Took <strong >{steps.current} steps</strong>  to sort an array of size {array?.length}</p>
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSorted])
  return {
    bubble,
    selection,
    merge,
    insertion,
    message,
    isSorted,
    clearMessage,
    setUnsorted,
  };
};
