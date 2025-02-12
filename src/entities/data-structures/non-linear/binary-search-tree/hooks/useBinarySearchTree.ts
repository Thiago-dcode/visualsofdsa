import { useEffect, useRef, useState } from "react";
import { OnCompare, TreeObj } from "../../tree/types";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";

export const useBinarySearchTree = () => {
  const [treeObj, _setTreeObj] = useState<TreeObj | null>(null);

  const { current: binarySearchTree } = useRef(new BinarySearchTree());

  const setTreeObj = () => {
    _setTreeObj(binarySearchTree.toTreeObj());
  };
  const insert = async (data: number) => {
    await binarySearchTree.insert(data);
    setTreeObj();
  };

  useEffect(() => {
    binarySearchTree.nodeHeight = 50;
    binarySearchTree.nodeWidth = 50;
  }, []);
  return {
    binarySearchTree,
    treeObj,
    insert,
  };
};
