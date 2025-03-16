import { useEffect, useRef, useState } from "react";
import { TreeObj, TreeObjFull } from "../../tree/types";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import useAnimationBts from "../../tree/hooks/useTreeAnimaton";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";

export const useBinarySearchTree = () => {
  const { current: binarySearchTree } = useRef(new BinarySearchTree());
  const { onCompareAnimation, insertAnimation, oppositeBranchAnimation } =
    useAnimationBts<number, BinaryTreeNode<number>>(binarySearchTree);
  const [treeObjFull, _setTreeObjFull] = useState<TreeObjFull<
    BinaryTreeNode<number>
  > | null>(null);

  const setTreeObjFull = () => {
    _setTreeObjFull(binarySearchTree.toTreeObj());
  };

  const mock = async (arr: number[]) => {
    arr.forEach(async (n) => await binarySearchTree.insert(n));

    setTreeObjFull();
  };

  const insert = async (data: number, onEnd = () => {}) => {
    const node = await binarySearchTree.insert(data, onCompareAnimation);
    if (node) node.isLastAdd = true;
    else {
      await oppositeBranchAnimation();
      onEnd();
    }

    setTreeObjFull();
  };
  const search = async (data: number) => {
    const node = await binarySearchTree.search(data, onCompareAnimation);

    await oppositeBranchAnimation();
  };
  useEffect(() => {
    binarySearchTree.nodeHeight = 75;
    binarySearchTree.nodeWidth = 75;
  }, []);
  return {
    binarySearchTree,
    treeObjFull,
    insert,
    insertAnimation,
    search,
    mock,
  };
};
