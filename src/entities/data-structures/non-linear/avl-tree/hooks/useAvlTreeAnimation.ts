import { useCallback, useState } from "react";
import useAnimation from "@/hooks/useAnimation";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { useSoundAnimation } from "@/hooks/useSoundAnimation";
import { animate } from "@/lib/animations";
import { speed } from "@/types";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import useTreeAnimaton from "../../tree/hooks/useTreeAnimaton";
import { AvlTree } from "../classes/AvlTree";
import { OnRotate } from "../types";

const ROTATE_DURATION: Record<speed, number> = {
  1: 1,
  2: 0.8,
  3: 0.6,
  4: 0.4,
};

const useAvlTreeAnimation = (tree: AvlTree<number>, speed: speed) => {
  const treeAnimation = useTreeAnimaton<number, BinaryTreeNode<number>>(tree, speed);
  const { focus, isAnimationEnabled } = useAnimation();
  const { animateSound } = useSoundAnimation();
  const prefersReducedMotion = usePrefersReducedMotion();
  // Ids of the nodes currently highlighted by a rotation, shown as a visible "rotating" label.
  const [rotatingIds, setRotatingIds] = useState<ReadonlySet<number>>(() => new Set());

  const onRotateAnimation: OnRotate<number> = useCallback(
    async (_type, pivot, newSubtreeRoot) => {
      if (!isAnimationEnabled) return;
      setRotatingIds(new Set([pivot.id, newSubtreeRoot.id]));
      // Smooth scrolling is skipped for visitors who asked for reduced motion.
      if (!prefersReducedMotion) focus(newSubtreeRoot.ref);
      animateSound(newSubtreeRoot.data, tree.min?.data ?? 0, tree.max?.data ?? 0);
      await Promise.all([
        animate(pivot.ref, "rotate-node", ROTATE_DURATION[speed] ?? ROTATE_DURATION[3]),
        animate(newSubtreeRoot.ref, "rotate-node", ROTATE_DURATION[speed] ?? ROTATE_DURATION[3]),
      ]);
      setRotatingIds(new Set());
    },
    [isAnimationEnabled, prefersReducedMotion, focus, animateSound, tree, speed],
  );

  return { ...treeAnimation, onRotateAnimation, rotatingIds };
};

export default useAvlTreeAnimation;
