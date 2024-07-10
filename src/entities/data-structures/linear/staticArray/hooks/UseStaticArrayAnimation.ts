import { useState } from "react";
const UseStaticArrayAnimation = () => {
  const createAnimation = async (
    ref: HTMLElement | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          console.log("ANIMATION RUNNIN");

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
    ref: HTMLElement | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (ref == null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          console.log("ANIMATION RUNNIN");

          resolve(true);
          ref.removeEventListener("animationend", animationEvent);
        };

        ref.style.animation = `add-node ${"1s"}`;

        ref.addEventListener("animationend", animationEvent);
        // requestAnimation(ref, `add-node ${"1s"}`, animationEvent);
      }
    });
  };
  return {
    createAnimation,
  };
};

export default UseStaticArrayAnimation;
