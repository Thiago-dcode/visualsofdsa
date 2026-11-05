import { useCallback } from "react";
import { useAnimationRunning } from "@/context/animationRunningContext";
import { animate } from "@/lib/animations";
import { Edge } from "@/lib/classes/Edge";
import { Ref } from "@/types";

const useAnimation = () => {
  const { isAnimationEnabled } = useAnimationRunning();
  const animateEdge = useCallback(
    async (edge: Edge, speed: number, firstCall: boolean = false) => {
      if (!isAnimationEnabled) return;
      await animate(edge.ref, `lit-node-edge`, speed, {
        onlyOnce: firstCall,
      });
    },
    [isAnimationEnabled],
  );
  const focus = useCallback(
    (ref: Ref) => {
      if (!isAnimationEnabled) return;
      if (ref) {
        ref.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [isAnimationEnabled],
  );

  const setProperty = useCallback((ref: Ref, property: string, value: string) => {
    if (ref) {
      ref.style.setProperty(`--${property}`, value);
    }
  }, []);
  return {
    animateEdge,
    focus,
    setProperty,
    isAnimationEnabled,
  };
};

export default useAnimation;
