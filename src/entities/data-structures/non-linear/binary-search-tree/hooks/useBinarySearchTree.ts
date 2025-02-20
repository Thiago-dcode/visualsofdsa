import { useEffect, useRef, useState } from "react";
import { OnCompare, TreeObj } from "../../tree/types";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import useAnimationBts from "../../tree/hooks/useTreeAnimaton";
import { Primitive } from "@/types";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";

export const useBinarySearchTree = () => {
  const { current: binarySearchTree } = useRef(new BinarySearchTree());
  const { onCompareAnimation, insertAnimation, oppositeBranchAnimation } =
    useAnimationBts<number, BinaryTreeNode<number>>(binarySearchTree);
  const [treeObj, _setTreeObj] = useState<TreeObj<
    BinaryTreeNode<number>
  > | null>(null);

  const setTreeObj = () => {
    _setTreeObj(binarySearchTree.toTreeObj());
  };
  const insert = async (data: number) => {
    const _onCompare: OnCompare<number, BinaryTreeNode<number>> = async (
      node,
      edge,
      data,
      oppoNode
    ) => {
      await onCompareAnimation(node, edge, oppoNode || undefined);
    };
    const node = await binarySearchTree.insert(data, _onCompare);
    if (node) node.isLastAdd = true;
    else await oppositeBranchAnimation();

    setTreeObj();
  };
  useEffect(() => {
    binarySearchTree.nodeHeight = 75;
    binarySearchTree.nodeWidth = 75;
  }, []);
  return {
    binarySearchTree,
    treeObj,
    insert,
    insertAnimation,
  };
};
