import { Primitive } from "@/types";
import { requestAnimation } from "@/lib/utils";
import LinkedList from "../classes/LinkedList";
const UseLinkedListAnimation = (linkedList: LinkedList<Primitive> | null) => {

  const getAnimation = async (
    ref: HTMLElement | null,
    found:boolean,
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
          !found?`find-node ${0.7 + "s"}`:`get-node ${1 + "s"}`,
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
