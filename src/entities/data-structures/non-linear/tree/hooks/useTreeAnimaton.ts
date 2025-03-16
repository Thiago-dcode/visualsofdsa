import Node from "@/entities/data-structures/linear/_classes/Node";
import { animate } from "@/lib/animations";
import { Edge } from "@/lib/classes/Edge";
import { Primitive } from "@/types";
import Tree from "../_classes/Tree";
import { OnCompare } from "../types";

const useTreeAnimaton = <T extends Primitive, K extends Node<T>>(
  tree: Tree<T, K>
) => {
  const onCompareAnimation: OnCompare<T, K> = async (
    node,
    edge,
    data,
    oppositeNode
  ) => {
    if (oppositeNode) await oppositeBranchAnimation(oppositeNode, false);
    if (edge && edge.ref) {
      await animate(edge.ref, `lit-node-edge ${0.5}s`);
    }
    if (node.ref) {
      await animate(
        node.ref,
        `${node.data === data ? `find-node ${0.8}s` : `compare-node ${0.5}s`}`
      );
    }
  };
  const insertAnimation = async (node: K) => {
    await animate(node.ref, `insert-node ${0.8}s`, () => {}, true);
    await oppositeBranchAnimation();
    node.isLastAdd = false;
  };

  const oppositeBranchAnimation = async (
    branch: K | null = null,
    enable = true
  ) => {
    await tree.inOrderTraversal(branch, async (node) => {
      animate(
        node.ref,
        `${enable ? "enable" : "disable"}-node ${0.5}s`,
        (ref) => {
          if (node.ref) {
            if (enable) {
              node.ref.style.opacity = "1";
              node.ref.style.transform = "scale(1)";
            } else {
              node.ref.style.opacity = "0.4";
              node.ref.style.transform = "scale(0.8)";
            }
          }
        }
      );
    });
  };
  return {
    onCompareAnimation,
    insertAnimation,
    oppositeBranchAnimation,

  };
};

export default useTreeAnimaton;
