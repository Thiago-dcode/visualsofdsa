import { useRef, useState } from "react";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import useAnimationBts from "../../tree/hooks/useTreeAnimaton";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import TreeLayout from "../../tree/_classes/TreeLayout";

export const useBinarySearchTree = () => {
  const { current: binarySearchTree } = useRef(new BinarySearchTree<number>());
  const [treeLayout, setTreeLayout] = useState(
    () => new TreeLayout<number, BinaryTreeNode<number>>(binarySearchTree)
  );
  const { onCompareAnimation, insertAnimation, oppositeBranchAnimation, onRemoveAnimation ,findSuccessor} =
    useAnimationBts<number, BinaryTreeNode<number>>(treeLayout.tree);

  const render = () => {
    setTreeLayout(
      prev => new TreeLayout<number, BinaryTreeNode<number>>(prev.tree)
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
    const result = await binarySearchTree.remove(data, onCompareAnimation,findSuccessor,onRemoveAnimation);
    await oppositeBranchAnimation();
    render();
  };

  return {
    treeLayout,
    insert,
    insertAnimation,
    search,
    mock,
    remove,
  };
};
