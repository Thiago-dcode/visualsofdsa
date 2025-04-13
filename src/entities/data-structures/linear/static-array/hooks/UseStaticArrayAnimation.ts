import { Primitive, speed } from "@/types";
import { animate } from "@/lib/animations";
import Node from "../../_classes/Node";
import useAnimation from "@/hooks/useAnimation";
import "../animation.css";
import { useCallback, useEffect, useRef } from "react";

const UseStaticArrayAnimation = (speed: speed) => {
  const { focus } = useAnimation();
  const speedRef = useRef<speed | null>(null);
  const getSpeed = useCallback(() => {
    if (!speedRef.current) return 0.5;
    switch (speedRef.current) {
      case 1:
        return 0.7;
      case 2:
        return 0.5;
      case 3:
        return 0.3;
      case 4:
        return 0.15;
      default:
        return 0.5;
    }
  }, []);

  useEffect(() => {
    speedRef.current = speed || speedRef.current;
  }, [speed]);
  const createAnimation = useCallback(
    async (
      node: Node<Primitive> | null,
      onAnimationEnds: ((e: AnimationEvent) => void) | null = null
    ): Promise<void> => {
      if (!node || !node.ref) return;
      await animate(node.ref, "add-node", getSpeed(), {
        onAnimationEnds,
        onlyOnce: true,
      });
    },
    [getSpeed]
  );

  const writeAnimation = useCallback(
    async (
      node: Node<Primitive> | null,
      isFilling: boolean = false,
      onAnimationEnds: ((e: AnimationEvent) => void) | null = null
    ): Promise<void> => {
      if (!node || !node.ref) return;
      focus(node.ref);
      await animate(
        node.ref,
        "write-node",
        getSpeed() * (isFilling ? 0.5 : 1),
        { onAnimationEnds }
      );
    },
    [getSpeed, focus]
  );

  const accessAnimation = useCallback(
    async (
      node: Node<Primitive> | null,
      onAnimationEnds: ((e: AnimationEvent) => void) | null = null
    ): Promise<void> => {
      if (!node || !node.ref) return;
      focus(node.ref);
      await animate(node.ref, "access-node", getSpeed(), { onAnimationEnds });
    },
    [getSpeed, focus]
  );

  const searchAnimation = useCallback(
    async (
      node: Node<Primitive> | null,
      onAnimationEnds: ((e: AnimationEvent) => void) | null = null
    ): Promise<void> => {
      if (!node || !node.ref) return;
      focus(node.ref);
      await animate(node.ref, "search-node", getSpeed() * 0.7, {
        onAnimationEnds,
      });
    },
    [getSpeed, focus]
  );

  return {
    createAnimation,
    writeAnimation,
    accessAnimation,
    searchAnimation,
  };
};

export default UseStaticArrayAnimation;
