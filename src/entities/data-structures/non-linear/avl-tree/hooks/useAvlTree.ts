import { useRef, useState } from "react";
import { toast } from "sonner";
import { createRandomUniqueArrayOfNumbers } from "@/lib/utils";
import { speed } from "@/types";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import TreeLayout from "../../tree/_classes/TreeLayout";
import { TraversalType } from "../../tree/types";
import { AvlTree } from "../classes/AvlTree";
import { OnRotate, RotationType } from "../types";
import useAvlTreeAnimation from "./useAvlTreeAnimation";

const MAX_TREE_SIZE = 200;
const MIN_INPUT_VALUE = -1000;
const MAX_INPUT_VALUE = 1000;

const ROTATION_CASE: Record<RotationType, string> = {
  left: "right-right",
  right: "left-left",
  "left-right": "left-right",
  "right-left": "right-left",
};

export const useAvlTree = (speed: speed) => {
  const { current: avlTree } = useRef(new AvlTree<number>());
  const [treeLayout, setTreeLayout] = useState(
    () => new TreeLayout<number, BinaryTreeNode<number>>(avlTree),
  );
  const [lastOperation, setLastOperation] = useState("");
  const {
    onCompareAnimation,
    insertAnimation,
    oppositeBranchAnimation,
    onRemoveAnimation,
    findSuccessor,
    onTraversal,
    animateEdge,
    onRotateAnimation,
    rotatingIds,
  } = useAvlTreeAnimation(avlTree, speed);

  const render = () => {
    setTreeLayout(new TreeLayout<number, BinaryTreeNode<number>>(avlTree));
  };
  const clear = () => {
    avlTree.clear();
    render();
    setLastOperation("Tree cleared");
  };
  const mock = async (arr: number[]) => {
    avlTree.clear();
    for (let i = 0; i < arr.length; i++) {
      await avlTree.insert(arr[i]);
    }
    render();
  };
  const createRandomTree = async (size: number) => {
    if (size > MAX_TREE_SIZE) {
      toast.error(`Tree size must be less than ${MAX_TREE_SIZE}`);
      return;
    }
    setLastOperation(`Creating a random tree with ${size} nodes`);
    await mock(createRandomUniqueArrayOfNumbers(size, [MIN_INPUT_VALUE, MAX_INPUT_VALUE]));
    setLastOperation(`Created a balanced random tree with ${size} nodes`);
  };

  // One announcement per rotation, then the animation.
  const onRotate: OnRotate<number> = async (type, pivot, newSubtreeRoot) => {
    setLastOperation(`Rotated ${type} at ${pivot.data} (${ROTATION_CASE[type]} case)`);
    await onRotateAnimation(type, pivot, newSubtreeRoot);
  };

  const insert = async (data: number, onEnd = () => {}) => {
    setLastOperation(`Inserting ${data}`);
    const node = await avlTree.insert(data, onCompareAnimation, onRotate);
    if (node) {
      node.isLastAdd = true;
      render();
      setLastOperation(`Inserted ${data}`);
    } else {
      await oppositeBranchAnimation();
      setLastOperation(`${data} is already in the tree`);
      onEnd();
    }
  };
  const search = async (data: number) => {
    setLastOperation(`Searching for ${data}`);
    const node = await avlTree.search(data, onCompareAnimation);
    await oppositeBranchAnimation();
    setLastOperation(node ? `Found ${data}` : `${data} is not in the tree`);
  };
  const remove = async (data: number) => {
    setLastOperation(`Removing ${data}`);
    const removed = await avlTree.remove(
      data,
      onCompareAnimation,
      findSuccessor,
      onRemoveAnimation,
      onRotate,
    );
    await oppositeBranchAnimation();
    render();
    setLastOperation(removed ? `Removed ${data}` : `${data} is not in the tree`);
  };
  const traverse = async (traverseType: TraversalType) => {
    setLastOperation(`Traversing: ${traverseType}`);
    const id = toast.loading(`Traversing: ${traverseType}`, {
      duration: Infinity,
    });
    await avlTree.traverse(traverseType, avlTree.root, onTraversal);
    toast.dismiss(id);
    setLastOperation(`Finished ${traverseType} traversal`);
  };

  return {
    treeLayout,
    insert,
    insertAnimation,
    search,
    mock,
    createRandomTree,
    remove,
    traverse,
    animateEdge,
    clear,
    lastOperation,
    rotatingIds,
    maxTreeSize: MAX_TREE_SIZE,
    minInputValue: MIN_INPUT_VALUE,
    maxInputValue: MAX_INPUT_VALUE,
  };
};
