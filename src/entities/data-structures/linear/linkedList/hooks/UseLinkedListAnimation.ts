import { Primitive } from "@/types";
import { getSpeed, requestAnimation } from "@/lib/utils";
import LinearDs from "../../_classes/LinearDs";
import LinkedList from "../classes/LinkedList";
const UseLinkedListAnimation = (linkedList: LinkedList<Primitive> | null) => {

  const getAnimation = async (
    ref: HTMLElement | null,

    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null || linkedList == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }

          ref.removeEventListener("animationend", animationEvent);
          resolve(true);
        };

        requestAnimation(
          ref,
          `peek-node ${1 + "s"}`,
          animationEvent
        );
      }
    });
  };

  return {

    getAnimation,

  };
};

export default UseLinkedListAnimation;
