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
          console.log("HELLO FROM CREATE ANIMATION");
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
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
    speed = 0.2
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
        requestAnimation(ref, `write-node ${speed}s`, animationEvent);
      }
    });
  };
  const accessAnimation = async (
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
        requestAnimation(ref, `access-node ${"1s"}`, animationEvent);
      }
    });
  };
  const searchAnimation = async (
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
        requestAnimation(ref, `search-node ${"0.2s"}`, animationEvent);
      }
    });
  };
  return {
    createAnimation,
    writeAnimation,
    accessAnimation,
    searchAnimation
  };
};

export default UseStaticArrayAnimation;
