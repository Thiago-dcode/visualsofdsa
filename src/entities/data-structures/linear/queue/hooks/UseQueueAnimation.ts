import { Primitive } from "@/types";
import { getSpeed } from "@/lib/utils";
import LinearDs from "../../_classes/LinearDs";
import { requestAnimation } from "@/lib/animations";
const UseQueueAnimation = (linearDs: LinearDs<Primitive> | null) => {
  const enqueueAnimation = async (
    ref: HTMLElement | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null || linearDs == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          resolve(true);
          ref.removeEventListener("animationend", animationEvent);
        };
        ref.style.setProperty("--start", `${linearDs?.beginner}px`);
        ref.style.setProperty(
          "--end",
          `${linearDs?.currentNode()?.position.y}px`
        );
        requestAnimation(
          ref,
          `add-node-${linearDs.name} ${getSpeed(linearDs.speed) + "s"}`,
          animationEvent
        );
      }
    });
  };
  const dequeueAnimation = async (
    ref: HTMLElement | null,

    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null || linearDs == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }

          ref.style.display = "none";

          ref.removeEventListener("animationend", animationEvent);
          resolve(true);
        };
        ref.style.setProperty("--start", `${ref.style.top}`);
        ref.style.setProperty("--end", `${-50}px`);
        requestAnimation(
          ref,
          `remove-node-${linearDs.name} ${getSpeed(linearDs.speed) + "s"}`,
          animationEvent
        );
      }
    });
  };
  const moveAnimation = async (
    ref: HTMLElement | null,
    i: number,

    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null || linearDs == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }

          ref.style.top = `${
            (linearDs.nodeHeight + linearDs.nodeHeightSpacing) * (i - 1) +
            linearDs.nodeHeightSpacing
          }px`;

          ref.removeEventListener("animationend", animationEvent);
          resolve(true);
        };
        ref.style.setProperty("--start", `${ref.style.top}`);
        ref.style.setProperty(
          "--end",
          `${
            (linearDs.nodeHeight + linearDs.nodeHeightSpacing) * (i - 1) +
            linearDs.nodeHeightSpacing
          }px`
        );

        requestAnimation(
          ref,
          `move-node-${linearDs.name} ${getSpeed(linearDs.speed) * 200 + "ms"}`,
          animationEvent
        );
      }
    });
  };

  return {
    enqueueAnimation,
    dequeueAnimation,
    moveAnimation,
  };
};

export default UseQueueAnimation;
