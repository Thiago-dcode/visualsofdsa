import SearchAlgorithm from "../_classes/SearchAlgorithm";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, Primitive, speed, VisualizationAlgorithms } from "@/types";
import "@/entities/data-structures/linear/staticArray/style.css";
import { animate } from "@/lib/animations";
import { toast } from "sonner";
import { delay } from "@/lib/utils";
type AlgotType = "linear" | "binary";
export default function useSearchAlgorithm(
  array: Node<number>[] | null,
  speed: speed = 1,
  visualization: VisualizationAlgorithms = 'memoryRam'
) {
  const getIndexRef = (ref: HTMLElement) =>
    ref.parentElement?.parentElement?.children[2] as HTMLElement;
  const getSpeed = (type: AlgotType) => {
    switch (speed) {
      case 1:
        return type === "linear" ? 0.5 : 1;
      case 2:
        return type === "linear" ? 0.3 : 0.7;
      case 3:
        return type === "linear" ? 0.1 : 0.5;
    }
  };
  const animateNode = async (
    ref: HTMLElement,
    found: boolean,
    type: AlgotType
  ) => {
    const indexRef = getIndexRef(ref);
    if (indexRef && visualization ==='memoryRam') {
      indexRef.style.visibility = "visible";
    }

    try {
      await animate(
        ref,
        !found
          ? `search-node ${getSpeed(type)}s`
          : `access-node ${type === "linear" ? 0.7 : 1.3}s`,
        (e) => {
          if (indexRef && visualization ==='memoryRam') {
            console.log('hidden something;')
            indexRef.style.visibility = "hidden";
          }
        }
      );
    } catch (error) {
      console.error("###ERROR ANIMATING LINEAR SEARCH ALGORITHM###");
    }
  };
  const linear = async (
    search: Primitive,
    isSorted: boolean,
    direction: Direction
  ) => {
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
          await animateNode(node.ref, found, "linear");
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
      isSorted,
      direction
    );

    if (!node) {
      toast.info(`${search} not presented in the array. Steps: ${steps || 1}`, {
        position: "top-center",
      });
    }
  };
  const binary = async (search: number, direction: Direction) => {
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
          await animateNode(
            middleNode.ref,
            middleNode.data === search,
            "binary"
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
      toast.info(`${search} is not presented in the array. Steps: ${steps || 1}`, {
        position: "top-center",
      });
    }
    for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if (!node || !node.ref) continue;
      toggleEnableNodeAnimation(node.ref, true);
    }
  };

  return { linear, binary };
}
