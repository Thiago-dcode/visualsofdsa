import { useRef, useState } from "react";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import useAnimationBts from "../../tree/hooks/useTreeAnimaton";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import TreeLayout from "../../tree/_classes/TreeLayout";
import { TraversalType } from "../../tree/types";
import { speed } from "@/types";
import { toast } from "sonner";

export const useBinarySearchTree = (speed:speed) => {
  const { current: binarySearchTree } = useRef(new BinarySearchTree<number>());
  const [treeLayout, setTreeLayout] = useState(
    () => new TreeLayout<number, BinaryTreeNode<number>>(binarySearchTree)
  );
  const {
    onCompareAnimation,
    insertAnimation,
    oppositeBranchAnimation,
    onRemoveAnimation,
    findSuccessor,
    onTraversal,
    animateEdge
  } = useAnimationBts<number, BinaryTreeNode<number>>(treeLayout.tree,speed);

  const render = () => {
    setTreeLayout(
      (prev) => new TreeLayout<number, BinaryTreeNode<number>>(prev.tree)
    );
  };

  const mock = async (arr: number[]) => {
    arr.forEach(async (n) => await binarySearchTree.insert(n));

    render();
  };

  const insert = async (data: number, onEnd = () => {}) => {
    const node = await binarySearchTree.insert(data, onCompareAnimation);
    if (node) {
      node.isLastAdd = true;
      render();
    } else {
      await oppositeBranchAnimation();
      onEnd();
    }
  };
  const search = async (data: number) => {
    const node = await binarySearchTree.search(data, onCompareAnimation);

    await oppositeBranchAnimation();
  };
  const remove = async (data: number) => {
    const result = await binarySearchTree.remove(
      data,
      onCompareAnimation,
      findSuccessor,
      onRemoveAnimation
    );
    await oppositeBranchAnimation();
    render();
  };
  const traverse = async (traverseType: TraversalType) => {
    const id = toast.loading(`Traversing: ${traverseType}`,{
      duration:Infinity
    })
   await binarySearchTree.traverse(traverseType,binarySearchTree.root,onTraversal);
   toast.dismiss(id);
  };

  return {
    treeLayout,
    insert,
    insertAnimation,
    search,
    mock,
    remove,
    traverse,
    animateEdge
  };
};
