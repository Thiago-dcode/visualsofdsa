import { animate } from "@/lib/animations";
import { Primitive } from "@/types";
import Tree from "../_classes/Tree";
import { OnCompare, OnTraversal, OnRemove } from "../types";
import TreeNode from "../_classes/TreeNode";

const useTreeAnimaton = <T extends Primitive, K extends TreeNode<T>>(
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
  const findSuccessor: OnTraversal<T, K> = async (node: K) => {
    // await animate(node.ref, `find-successor ${0.8}s`, () => {}, true);
  };
  const onRemoveAnimation: OnRemove<T, K> = async (node: K, substituteNode: K | null | undefined) => {
    if (!node.ref) return;
    if (substituteNode && substituteNode.ref) {
      await animate(node.ref, `remove-node ${0.8}s`, () => {}, true);
      node.ref.style.display = "none";
      substituteNode.ref.style.setProperty("--left_from", `${substituteNode.position.x}px`);
      substituteNode.ref.style.setProperty("--top_from", `${substituteNode.position.y}px`);
      substituteNode.ref.style.setProperty("--left_to", `${node.position.x}px`);
      substituteNode.ref.style.setProperty("--top_to", `${node.position.y}px`);
      await animate(substituteNode.ref, `move-node ${0.8}s`, () => {}, true);
      node.ref.textContent = substituteNode.data?.toString() ?? "";
      node.ref.style.display = "block";
     substituteNode.ref.style.display = "none";


    }
    else {
      await animate(node.ref, `remove-node ${0.8}s`, () => {}, true);
      node.ref.style.display = "none";
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
    onRemoveAnimation,
    findSuccessor

  };
};

export default useTreeAnimaton;
