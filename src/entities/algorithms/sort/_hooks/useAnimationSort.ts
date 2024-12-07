import { Direction, VisualizationArrays } from "@/types";
import { useAnimation } from "../../_hooks/useAnimations";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { animate } from "@/lib/animations";

export const useAnimationSort = (visualization: VisualizationArrays) => {
  const animateBubbleOnSwap = async (
    nodeA: Node<number>,
    nodeB: Node<number>,
    speed: number
  ) => {
    if (nodeA.ref && nodeB.ref) {
      const refA = nodeA.ref;
      const refB = nodeB.ref;
      switch (visualization) {
        case "bars":
          refA.style.setProperty("--from", `${nodeA.position.x}px`);
          refA.style.setProperty("--to", `${nodeB.position.x}px`);
          refA.style.setProperty("--color", `rgb(245 168 69 )`);
          refB.style.setProperty("--from", `${nodeB.position.x}px`);
          refB.style.setProperty("--to", `${nodeA.position.x}px`);
          refB.style.setProperty("--color", `rgb(245 168 69 )`);

          await Promise.all([
            animate(refA, `move-node ${speed}s`, () => {}),
            animate(refB, `move-node ${speed}s`, () => {}),
          ]);
          //On animation ends swap positions and color
          const tempAColor = refA.style.backgroundColor;
          const tempAPosition = nodeA.position.x;
          refA.style.left = nodeB.position.x + "px";
          refA.style.backgroundColor = refB.style.backgroundColor;
          nodeA.position.x = nodeB.position.x;
          refB.style.backgroundColor = tempAColor;
          refB.style.left = tempAPosition + "px";
          nodeB.position.x = tempAPosition;
          break;

        case "memoryRam":
            var rect = refA.getBoundingClientRect();
            console.log(rect);
          const tempA = nodeA.data;
          refA.textContent = nodeB.data + "";
          refB.textContent = tempA + "";

          break;
        default:
          break;
      }
    }
  };

  return {
    ...useAnimation(visualization),
    animateBubbleOnSwap,
  };
};
