import { Primitive } from "@/types";
import { requestAnimation } from "../../../../../lib/utils";
import Node from "../../_classes/Node";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
const useDynamicArrayAnimation = () => {
  const insertAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
                resolve(true);
          ref.removeEventListener("animationend", animationEvent);
        };
        console.log("RIGHT:",ref.offsetLeft,node.data)
        // ref.style.setProperty("--start", `${ref.offsetLeft}px`);
        // ref.style.setProperty(
        //   "--end",
        //   `${100}px`
        // );
        requestAnimation(ref, `access-node ${"0.5s"}`, animationEvent);
      }
    });
  };

 
  return {
    insertAnimation,

  };
};

export default useDynamicArrayAnimation;
