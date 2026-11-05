import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import useAnimation from "@/hooks/useAnimation";
import { useSoundAnimation } from "@/hooks/useSoundAnimation";
import { animate } from "@/lib/animations";
import { Primitive, speed } from "@/types";
import { BinarySearchTree } from "../../binary-search-tree/classes/BinarySearchTree";
import Tree from "../_classes/Tree";
import TreeNode from "../_classes/TreeNode";
import { OnCompare, OnFindSuccessor, OnRemove, OnTraversal } from "../types";

type TreeAction = "traverse" | "compare" | "insert" | "remove" | "move" | "successor";

const SPEED_SCALED_DURATION: Record<speed, number> = {
  1: 0.8,
  2: 0.5,
  3: 0.3,
  4: 0.2,
};
const FIXED_DURATION = 0.8;

const useTreeAnimaton = <T extends Primitive, K extends TreeNode<T>>(
  tree: Tree<T, K>,
  speed: speed,
) => {
  const { animateSound } = useSoundAnimation();
  const getMinMax = (tree: Tree<T, K>) => {
    if (tree instanceof BinarySearchTree) {
      const min = tree.min?.data;
      const max = tree.max?.data;
      if (typeof min === "number" && typeof max === "number") {
        return { min, max };
      }
    }
    return { min: 0, max: 0 };
  };
  const handleSound = useCallback(
    (node: K) => {
      if (typeof node.data === "number") {
        const { min, max } = getMinMax(tree);
        animateSound(node.data, min, max);
      }
    },
    [getMinMax],
  );
  const getSpeed = useCallback(
    (action: TreeAction): number => {
      switch (action) {
        case "traverse":
        case "compare":
          return SPEED_SCALED_DURATION[speed] ?? SPEED_SCALED_DURATION[1];
        case "insert":
        case "remove":
        case "move":
        case "successor":
          return FIXED_DURATION;
      }
    },
    [speed],
  );
  const { animateEdge, focus } = useAnimation();
  const onTraversal: OnTraversal<T, K> = async (node, edge) => {
    if (!node.ref) return;
    focus(node.ref);
    handleSound(node);
    await animate(node.ref, `find-node`, getSpeed("traverse"));
    if (edge?.ref) await animateEdge(edge, 0.5, false);
  };

  const onCompareAnimation: OnCompare<T, K> = async (node, edge, data, oppositeNode) => {
    if (oppositeNode) await oppositeBranchAnimation(oppositeNode, false);
    if (edge?.ref) {
      await animate(edge.ref, `lit-node-edge`, getSpeed("compare"));
    }
    if (node.ref) {
      const foundNode = node.data === data;
      focus(node.ref);
      handleSound(node);
      await animate(
        node.ref,
        `${foundNode ? `find-node` : `compare-node`}`,
        getSpeed("compare") * (foundNode ? 0.5 : 1),
      );
    }
  };
  const findSuccessor: OnFindSuccessor<T, K> = async (node, edge, isFirstCall, found) => {
    let toastId: string | number | undefined;
    if (isFirstCall) {
      toastId = toast.loading("Finding successor...", {
        duration: Infinity,
      });
    }
    focus(node.ref);
    handleSound(node);
    await animate(node.ref, `find-node`, getSpeed("successor"));

    if (edge?.ref) {
      await animateEdge(edge, 0.5);
    }

    if (found) {
      toast.dismiss(toastId);
    }
  };
  const onRemoveAnimation: OnRemove<T, K> = async (node, successor, isCaseThree) => {
    const nodeRef = node.ref;

    if (!nodeRef) return;
    if (successor?.ref) {
      const successorRef = successor.ref;
      if (!isCaseThree) {
        handleSound(node);
        await animate(nodeRef, `remove-node`, getSpeed("remove"));
        nodeRef.style.display = "none";
      }
      focus(successorRef);
      handleSound(successor);
      await animate(successorRef, `move-node`, getSpeed("move"), {
        properties: {
          top_from: `${successor.position.y}px`,
          left_from: `${successor.position.x}px`,
          top_to: `${node.position.y}px`,
          left_to: `${node.position.x}px`,
        },
      });
      successor.position.x = node.position.x;
      successor.position.y = node.position.y;
      successorRef.style.left = `${successor.position.x}px`;
      successorRef.style.top = `${successor.position.y}px`;

      if (isCaseThree) {
        nodeRef.style.visibility = "visible";
      }
    } else {
      handleSound(node);
      await animate(nodeRef, `remove-node`, getSpeed("remove"));
      nodeRef.style.visibility = "hidden";
    }
  };
  const insertAnimation = async (node: K) => {
    focus(node.ref);
    handleSound(node);
    await animate(node.ref, `insert-node`, getSpeed("insert"), {
      onlyOnce: true,
    });
    await oppositeBranchAnimation();
    node.isLastAdd = false;
  };

  useEffect(() => {
    console.log("SPEED CHANGED", speed);
  }, [speed]);
  const oppositeBranchAnimation = async (branch: K | null = null, enable = true) => {
    await tree.inOrderTraversal(branch || tree.root, async (node) => {
      animate(node.ref, `${enable ? "enable" : "disable"}-node`, 0.5, {
        onAnimationEnds: (_e) => {
          if (node.ref) {
            if (enable) {
              node.ref.style.opacity = "1";
              node.ref.style.transform = "scale(1)";
            } else {
              node.ref.style.opacity = "0.4";
              node.ref.style.transform = "scale(0.8)";
            }
          }
        },
      });
    });
  };
  return {
    onCompareAnimation,
    insertAnimation,
    oppositeBranchAnimation,
    onRemoveAnimation,
    findSuccessor,
    onTraversal,
    animateEdge,
  };
};

export default useTreeAnimaton;
