import { Primitive } from "@/types";
import { requestAnimation } from "../../../../../lib/utils";
import Node from "../../_classes/Node";
const UseStaticArrayAnimation = () => {
  const createAnimation = async (
    node: Node<Primitive> | null,
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
          console.log('HELLO FROM CREATE ANIMATION')
          resolve(true);
          ref.removeEventListener("animationend", animationEvent);
        };

         ref.style.animation = `add-node ${"1s"}`;

         ref.addEventListener("animationend", animationEvent);
        // requestAnimation(ref, `add-node ${"1s"}`, animationEvent);
      }
    });
  };

  const writeAnimation = async (
    node: Node<Primitive> | null,
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
        console.log('WRITE ANIMATION', node.data)
        // const p = ref.firstChild as HTMLElement;
        // if (p) {
        //   console.log(node.data)
        //   if (node.data) {
        //     p.style.color = "white";
        //     p.textContent = node.data + "";
        //   } else {
        //     p.style.color = "rgb(59 130 246)";
        //     p.textContent = "NULL";
        //   }
        // }
     
        // ref.style.animation = "none";
        // ref.style.animation = `write-node ${"1s"}`;
        // ref.addEventListener("animationend", animationEvent);
        requestAnimation(ref, `write-node ${"1s"}`, animationEvent);
      }
    });
  };
  return {
    createAnimation,
    writeAnimation,
  };
};

export default UseStaticArrayAnimation;
