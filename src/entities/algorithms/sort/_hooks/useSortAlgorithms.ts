import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, speed, VisualizationArrays } from "@/types";
import { SortAlgorithms } from "../_classes/SortAlgorithms";
import { ClosureCompare } from "../types";
import { useState } from "react";
import { useAnimation } from "../../_hooks/useAnimations";
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
        default: 
          0.3;
      }
    case 2:
      switch (type) {
        case "bubble":
          return 0.175;
        default:
          0.2;
      }
    case 3:
      switch (type) {
        case "bubble":
          return 0.05;
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
  visualization: VisualizationArrays = "memoryRam"
) => {
  let minArrayValue = 0;
  let maxArrayValue = 0;
  if (array) {
    minArrayValue = getMinInAnArrayOfNodes(array);
    maxArrayValue = getMaxInAnArrayOfNodes(array);
  }
  const { animateNode, animateSound, animateBubbleOnSwap } =
    useAnimationSort(visualization);
  const [isSorted, setIsSorted] = useState(false);
  const bubble = async () => {
    let steps = 0;
    const onCompare: ClosureCompare = async (nodeA, nodeB) => {
      steps++;
      try {
        if (nodeA.ref && nodeB.ref) {
          animateSound(nodeA.data, minArrayValue, maxArrayValue);
          animateSound(nodeB.data, minArrayValue, maxArrayValue);
          await Promise.all([
            animateNode(nodeA.ref, "search", getSpeed("bubble", speed)),
            animateNode(nodeB.ref, "search", getSpeed("bubble", speed)),
          ]);
        }
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM");
      }
    };
    const onSwap: ClosureCompare = async (nodeA, nodeB) => {
      try {
        // animateSound(nodeA.data, minArrayValue, maxArrayValue);
        // animateSound(nodeB.data, minArrayValue, maxArrayValue);
        await animateBubbleOnSwap(
          nodeA,
          nodeB,
          getSpeed("bubble", speed) 
        );
      } catch (error) {
        console.error("ERROR ANIMATING BUBBLE SORT ALGORITHM",error);
      }
    };
    await SortAlgorithms.bubble(array,direction, onCompare, onSwap);
    toast.success( `Took ${steps|| 1} to sort an array of size ${array.length}`,
      {
        position: "top-center",
      }
    );

    setIsSorted(true);
  };
  const selection = async () => {};
  const merge = async () => {};
  const quick = async () => {};
  const insertion = async () => {};
  const setUnsorted = () => {
    setIsSorted(false);
  };
  return {
    bubble,
    selection,
    merge,
    quick,
    insertion,
    isSorted,
    setUnsorted,
  };
};
