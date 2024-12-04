import SearchAlgorithm from "../_classes/SearchAlgorithm";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, Primitive, speed, VisualizationArrays } from "@/types";
import "@/entities/data-structures/linear/staticArray/style.css";
import { animate } from "@/lib/animations";
import { toast } from "sonner";
import {
  delay,
  getMaxInAnArrayOfNodes,
  getMinInAnArrayOfNodes,
} from "@/lib/utils";
import { useAnimation } from "../../_hooks/useAnimations";
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
    minArrayValue = sorted
      ? array[direction === "forward" ? 0 : array.length - 1].data
      : getMinInAnArrayOfNodes(array);
    maxArrayValue = sorted
      ? array[direction === "forward" ? array.length - 1 : 0].data
      : getMaxInAnArrayOfNodes(array);
  }

const {animateNode,animateSound} = useAnimation()
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
          animateSound(node.data as number,minArrayValue,maxArrayValue);
          await animateNode(node.ref, found, "linear", visualization, speed);
         
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
          animateSound(middleNode.data as number,minArrayValue,maxArrayValue);
          await animateNode(
            middleNode.ref,
            middleNode.data === search,
            "binary",
            visualization,
            speed
          );
         
          if (middleNode.data !== search) {
            if (
              (direction === "forward" && middleNode.data > search) ||
              (direction === "reverse" && middleNode.data < search)
            ) {
              //disable nodes from right side
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
