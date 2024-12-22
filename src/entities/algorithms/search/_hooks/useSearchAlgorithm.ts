import SearchAlgorithm from "../_classes/SearchAlgorithm";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, Primitive, speed, VisualizationArrays } from "@/types";
import { animate } from "@/lib/animations";
import { toast } from "sonner";
import {
  delay,
  getMaxInAnArrayOfNodes,
  getMinInAnArrayOfNodes,
  getMinMaxFromArrayOfNodes,
} from "@/lib/utils";
import { useAnimation } from "../../_hooks/useAnimations";
import { AlgoSearchType } from "../../types";
const getSpeed = (type: AlgoSearchType, speed: number) => {
  switch (speed) {
    case 1:
      return type === "linear" ? 0.5 : 1;
    case 2:
      return type === "linear" ? 0.3 : 0.65  ;
    case 3:
      return type === "linear" ? 0.1 : 0.3;
    default:
      return 0.5;
  }
};
export default function useSearchAlgorithm(
  array: Node<number>[] | null,
  sorted: boolean,
  direction: Direction,
  speed: speed = 1,
  visualization: VisualizationArrays = "memoryRam"
) {
 
  let minArrayValue = 0;
  let maxArrayValue = 0;
  if (array) {
    const minMax = getMinMaxFromArrayOfNodes(array,direction,sorted);
    minArrayValue = minMax.min;
    maxArrayValue = minMax.max;
  }

  const { animateNode, animateSound } =
    useAnimation(visualization);

  const linear = async (search: Primitive) => {
    if (!array) {
      toast.error(`Expected an array, null given`, {
        position: "top-center",
      });
      return;
    }
    let steps = 0;

    const node = await SearchAlgorithm.linear(
      array,
      search,
      async (node, index, found) => {
        steps++;

        if (node.ref) {
          if (visualization === "bars")
            animateSound(node.data as number, minArrayValue, maxArrayValue);
  
             await animateNode(node.ref,found?'find':'search',found?1.5:getSpeed('linear',speed))

          if (found) {
            toast.success(
              `${search} found on index ${index}. Steps: ${steps || 1}`,
              {
                position: "top-center",
              }
            );
          }
        }
      },
      sorted,
      direction
    );

    if (!node) {
      toast.info(`${search} not presented in the array. Steps: ${steps || 1}`, {
        position: "top-center",
      });
    }
  };
  const binary = async (search: number) => {
    if (!array) {
      toast.error(`Expected an array, null given`, {
        position: "top-center",
      });
      return;
    }
    const toggleEnableNodeAnimation = async (
      ref: HTMLElement,
      isEnable = false
    ) => {
      if (isEnable) {
        await animate(ref, "enable-node 0.4s", () => {
          ref.style.opacity = "1";
        });
        return;
      }
      await animate(ref, "disable-node 0.4s", () => {
        ref.style.opacity = "0.4";
      });
    };
    let steps = 0;
    const node = await SearchAlgorithm.binary(
      array,
      search,
      async (middle, start, end) => {
        steps++;
        const middleNode = array[middle];

        if (middleNode && middleNode.ref) {
          if (visualization === "bars")
            animateSound(
              middleNode.data as number,
              minArrayValue,
              maxArrayValue
            );
            const found = middleNode.data === search
            await animateNode(middleNode.ref,found?'find':'search',found?2:getSpeed('binary',speed))


          if (!found) {
            if (
                //disable nodes from right side
              (direction === "ascending" && middleNode.data > search) ||
              (direction === "descending" && middleNode.data < search)
            ) {
           
              for (let i = middle; i <= end; i++) {
                const node = array[i];
                if (!node || !node.ref) continue;
                toggleEnableNodeAnimation(node.ref, false);
              }
            } else {
              //disable nodes from left side
              for (let i = start; i <= middle; i++) {
                const node = array[i];
                if (!node || !node.ref) continue;
                toggleEnableNodeAnimation(node.ref, false);
              }
            }
            await delay(500);
          } else {
            toast.success(
              `${search} found on index ${middle}. Steps: ${steps || 1}`,
              {
                position: "top-center",
              }
            );
          }
        }
      },
      direction
    );
    if (!node) {
      toast.info(
        `${search} is not presented in the array. Steps: ${steps || 1}`,
        {
          position: "top-center",
        }
      );
    }
    for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if (!node || !node.ref) continue;
      toggleEnableNodeAnimation(node.ref, true);
    }
  };

  return { linear, binary, minArrayValue, maxArrayValue };
}
