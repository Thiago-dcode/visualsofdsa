import { VisualizationArrays } from "@/types";
import { useAnimation } from "../../_hooks/useAnimations";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { animate } from "@/lib/animations";
import {  removePx } from "@/lib/utils";

export const useAnimationSort = (visualization: VisualizationArrays) => {
  const animations = useAnimation(visualization);

  const animationOnSlice = async (
    array: Node<number>[],
    maxBarSize: number,
    speed: number
  ) => {
    const onAnimationEnds = (node:Node<number>) => {
      if(!node.ref)return;
      node.ref.style.bottom = node.position.y + "px";
    
    };
    const arrayOfPromiseses = array.map((node,i) => {
      const ref = node.ref;

      if (!ref) return null;
      ref.style.marginBottom = '50px'
      ref.scrollIntoView({
        behavior:'smooth'
      })
      ref.style.setProperty("--color", "rgba(245 168 69)");
      ref.style.setProperty("--left_from", `${node.position.x}px`);
      ref.style.setProperty("--bottom_from", `${node.position.y}px`);
      ref.style.setProperty("--left_to", `${node.position.x}px`);
      node.position.y =node.position.y - maxBarSize
      ref.style.setProperty("--bottom_to", `${node.position.y}px`);
      return animate(ref, `move-node ${speed}s`, () => {
    
        onAnimationEnds(node);
      });
    });

    await Promise.all(arrayOfPromiseses);
  };
  const animationOnMerge = async (
    nodeA: Node<number>,
    nodeB: Node<number>,
    speed: number
  ) => {
    if (nodeA.ref && nodeB.ref) {
      const refA = nodeA.ref;
      const refB = nodeB.ref;
      refB.style.setProperty("--color", `rgb(245 168 69 )`);
      refB.style.setProperty("--left_from", `${nodeB.position.x}px`);
      nodeB.position.x = nodeA.position.x;
      refB.style.setProperty("--left_to", `${nodeB.position.x}px`);
      refB.style.setProperty("--bottom_from", `${nodeB.position.y}px`);
      nodeB.position.y = nodeA.position.y;
      refB.style.setProperty("--bottom_to", `${nodeB.position.y}px`);
      await animate(refB, `move-node ${speed}s`, () => {});
       
      refB.style.left = nodeB.position.x + "px";
      refB.style.bottom = nodeB.position.y + "px";
    }
  };
  const animateOnSwap = async (
    nodeA: Node<number>,
    nodeB: Node<number>,
    speed: number
  ) => {
    if (nodeA.ref && nodeB.ref) {
      const refA = nodeA.ref;
      const refB = nodeB.ref;
      //Before animation
      switch (visualization) {
        case "bars":
          refA.style.setProperty("--left_from", `${nodeA.position.x}px`);
          refA.style.setProperty("--bottom_from", `${nodeA.position.y}px`);
          refA.style.setProperty("--left_to", `${nodeB.position.x}px`);
          refA.style.setProperty("--bottom_to", `${nodeA.position.y}px`);
          refB.style.setProperty("--left_from", `${nodeB.position.x}px`);
          refB.style.setProperty("--left_to", `${nodeA.position.x}px`);
          refB.style.setProperty("--bottom_from", `${nodeB.position.y}px`);
          refB.style.setProperty("--bottom_to", `${nodeA.position.y}px`);

          break;

        case "memoryRam":
          const setUpMemoyRam = (refA: HTMLElement, refB: HTMLElement) => {
            refA.style.position = "relative";
            refB.style.position = "relative";
            refA.style.zIndex = "99px";
            refB.style.zIndex = "99px";
            const rectA = refA.getBoundingClientRect();
            const rectB = refB.getBoundingClientRect();
            const leftA = rectA.left;
            const leftB = rectB.left;
            const currentLeftA = removePx(refA.style.left);
            const currentLeftB = removePx(refB.style.left);
            nodeA.position.x = currentLeftA + (leftB - leftA);
            nodeB.position.x = currentLeftB + (leftA - leftB);
            const bottomA = rectA.bottom;
            const bottomB = rectB.bottom;
            const currentBottomA = removePx(refA.style.bottom);
            const currentBottomB = removePx(refB.style.bottom);
            nodeA.position.y = currentBottomA - (bottomB - bottomA);
            nodeB.position.y = currentBottomB + (bottomB - bottomA);

            refA.style.setProperty("--left_from", `${currentLeftA}px`);
            refA.style.setProperty("--left_to", `${nodeA.position.x}px`);
            refA.style.setProperty("--bottom_from", `${currentBottomA}px`);
            refA.style.setProperty("--bottom_to", `${nodeA.position.y}px`);
            refB.style.setProperty("--left_from", `${currentLeftB}px`);
            refB.style.setProperty("--left_to", `${nodeB.position.x}px`);
            refB.style.setProperty("--bottom_from", `${currentBottomB}px`);
            refB.style.setProperty("--bottom_to", `${nodeB.position.y}px`);
          };
          setUpMemoyRam(refA, refB);
          const indexA = animations.getIndexRef(refA);
          const indexB = animations.getIndexRef(refB);
          indexA.style.visibility = "visible";
          indexB.style.visibility = "visible";
          const temp = indexA.textContent;
          indexA.textContent = indexB.textContent;
          indexB.textContent = temp;
          setUpMemoyRam(indexA, indexB);
          break;
        default:
          break;
      }
      //On animate
      refA.style.setProperty("--color", `rgb(245 168 69 )`);
      refB.style.setProperty("--color", `rgb(245 168 69 )`);
      await Promise.all([
        animate(refA, `move-node ${speed * 1.1}s`, () => {}),
        visualization == "memoryRam"
          ? animate(
              animations.getIndexRef(refA),
              `move-node ${speed * 1.1}s`,
              () => {}
            )
          : null,
        animate(refB, `move-node ${speed * 1.1}s`, () => {}),
        visualization == "memoryRam"
          ? animate(
              animations.getIndexRef(refB),
              `move-node ${speed * 1.1}s`,
              () => {}
            )
          : null,
      ]);

      //After animation
      switch (visualization) {
        case "bars":
          const tempAColor = refA.style.backgroundColor;
          const tempXAPosition = nodeA.position.x;
          const tempYAPosition = nodeA.position.y;
          refA.style.left = nodeB.position.x + "px";
          refA.style.bottom = nodeB.position.y + "px";
          refA.style.backgroundColor = refB.style.backgroundColor;
          nodeA.position.x = nodeB.position.x;
          nodeA.position.y = nodeB.position.y;
          refB.style.backgroundColor = tempAColor;
          refB.style.left = tempXAPosition + "px";
          refB.style.bottom = tempYAPosition + "px";
          nodeB.position.x = tempXAPosition;
          nodeB.position.y = tempYAPosition;
          break;

        case "memoryRam":
          const setUpMemoyRam = (refA: HTMLElement, refB: HTMLElement) => {
            refA.style.left = nodeA.position.x + "px";
            refB.style.left = nodeB.position.x + "px";
            refA.style.bottom = nodeA.position.y + "px";
            refB.style.bottom = nodeB.position.y + "px";
          };
          setUpMemoyRam(refA, refB);
          const indexA = animations.getIndexRef(refA);
          const indexB = animations.getIndexRef(refB);
          indexA.style.visibility = "hidden";
          indexB.style.visibility = "hidden";

          setUpMemoyRam(indexA, indexB);
          break;

        default:
          break;
      }
    }
  };

  return {
    ...animations,
    animateOnSwap,
    animationOnSlice,
    animationOnMerge,
  };
};
