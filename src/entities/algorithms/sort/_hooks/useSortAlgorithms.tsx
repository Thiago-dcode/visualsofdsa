import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, speed, VisualizationArrays } from "@/types";
import { SortAlgorithms } from "../_classes/SortAlgorithms";
import { ClosureCompare, ClosureSlice } from "../types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes } from "@/lib/utils";
import { useAnimationSort } from "./useAnimationSort";
import { AlgoSortType } from "../../types";
const getSpeed = ( speed: number) => {
  switch (speed) {
    case 1:
      return 0.3;
    case 2:
      return 0.15
    case 3:
      return 0.07
    case 4:
      return 0.015
  }
  return 0.1;
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


  const comparisionBased = async (type: AlgoSortType) => {
    const allowedTypes: AlgoSortType[] = ['bubble', 'insertion', 'selection'];
    if (!allowedTypes.includes(type)) return;
    const onCompare: ClosureCompare = async (nodeA, nodeB) => {

      try {
        if (nodeA.ref && nodeB.ref) {
          animateSound(nodeA.data, minArrayValue, maxArrayValue);
          animateSound(nodeB.data, minArrayValue, maxArrayValue);
          await Promise.all([
            animateNode(nodeA.ref, 'search', getSpeed(speed)),
            animateNode(nodeB.ref, type !== 'selection' ? "search" : 'select', getSpeed(speed)),
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
          getSpeed(speed)
        );
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM", error);
      }
    };
    onSortEnds(await SortAlgorithms[type as 'bubble' | 'insertion' | 'selection'](array, direction, onCompare, onSwap));
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


      await animationOnSlice(array, maxBarSize, getSpeed(speed), async (node) => {
        animateSound(node.data, minArrayValue, maxArrayValue)

      });

    }
    const onMerge: ClosureCompare = async (nodeA, nodeB) => {

      animateSound(nodeB.data, minArrayValue, maxArrayValue)
      await animationOnMerge(nodeA, nodeB, getSpeed(speed));

    }

    onSortEnds(await SortAlgorithms.merge(array as Node<number>[], direction, onSlice, onMerge));
  }

  const quick = async () => {
    const onPivot = async (pivot: Node<number>) => {
      if (pivot.ref) pivot.ref.style.backgroundColor = 'red'


    }
    const onCompare = async (start: number, end: number) => {
      const animationPromises: Promise<void>[] = [];
      for (let i = start; i < end; i++) {
        const element = array[i];
        if (!element || !element.ref) continue;
        animationPromises.push(animateNode(element.ref, 'search', getSpeed(speed)))
      }
      await Promise.all(animationPromises);
    }
    const onSwap: ClosureCompare = async (nodeA, nodeB) => {
      animateSound(nodeA.data, minArrayValue, maxArrayValue);
      animateSound(nodeB.data, minArrayValue, maxArrayValue);
      await animateOnSwap(nodeA, nodeB, getSpeed(speed));
    }
    onSortEnds(await SortAlgorithms.quick(array as Node<number>[], direction, onPivot, onSwap, onCompare));
  }
  const onSortEnds = (steps: number) => {
    setMessage({
      title: 'STEPS TAKEN',
      description: <p>Took <strong >{steps} steps</strong>  to sort an array of size {array?.length}</p>
    })
    setIsSorted(true);
  }
  const setUnsorted = () => {
    setIsSorted(false);
  };
  const clearMessage = () => {
    setMessage(null);
  }

  return {
    bubble,
    selection,
    merge,
    quick,
    insertion,
    message,
    isSorted,
    clearMessage,
    setUnsorted,
  };
};
