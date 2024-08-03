import { Primitive } from "@/types";
import { delay, requestAnimation } from "../../../../../lib/utils";
import Node from "../../_classes/Node";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
const useDynamicArrayAnimation = () => {
  const insertAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    index: number,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef = node.ref.parentElement?.parentElement
          ?.children[2] as HTMLElement;
        const nextNode = ref.parentElement?.parentElement?.parentElement
          ?.children[index + 1].children[1] as HTMLElement;
        let isBreakLine = false;
        const animationEvent = async (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          if (isBreakLine) {
            const left = `-${2 * DynamicArrayNode.nodeSize}px`;
            console.log(
              "REF",
              node.data,
              ref.style.left,
              ref.getBoundingClientRect()
            );
            ref.style.left = left;
            indexRef.style.left = left;
           
          
          } else {
            ref.style.left = DynamicArrayNode.nodeSize + "px";
            if (indexRef) {
              indexRef.style.left = DynamicArrayNode.nodeSize + "px";
            }

            ref.removeEventListener("animationend", animationEvent);
          }
          resolve(true);
        };

        if (nextNode) {
          isBreakLine =
            ref.getBoundingClientRect().top !==
            nextNode.getBoundingClientRect().top;
        }
        if (isBreakLine) {
          if (indexRef) {
            // indexRef.style.top = nextNode.getBoundingClientRect().top + 'px';
            const top = Math.abs(
              ref.getBoundingClientRect().top -
                nextNode.getBoundingClientRect().top
            );
            const left = `-${
              ref.getBoundingClientRect().x -
              nextNode.getBoundingClientRect().x +
              DynamicArrayNode.nodeSize
            }px`;

            ref.style.top = top + "px";
            indexRef.style.top = top + "px";

            ref.style.left = left;
            indexRef.style.left = left;

            // indexRef.style.left = (nextNode.getBoundingClientRect().left - DynamicArrayNode.nodeSize) + 'px';
            // ref.style.left = (nextNode.getBoundingClientRect().left - DynamicArrayNode.nodeSize) + 'px';
          }
        }

        if (indexRef) {
          indexRef.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);
          requestAnimation(indexRef, `insert-node ${"0.4s"}`, animationEvent);
        }
        ref.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);

        requestAnimation(ref, `insert-node ${"0.4s"}`, animationEvent);
      }
    });
  };

  const popAnimation = async (
    node: Node<Primitive> | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
    speed = 0.2
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef = node.ref.parentElement?.parentElement
          ?.children[2] as HTMLElement;
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          resolve(true);
          ref.style.display = "none";
          if (indexRef) indexRef.style.visibility = "hidden";
          ref.removeEventListener("animationend", animationEvent);
        };
        if (indexRef) {
          requestAnimation(indexRef, `pop-node ${1}s`, animationEvent);
        }
        requestAnimation(ref, `pop-node ${1}s`, animationEvent);
      }
    });
  };
  return {
    insertAnimation,
    popAnimation,
  };
};

export default useDynamicArrayAnimation;
