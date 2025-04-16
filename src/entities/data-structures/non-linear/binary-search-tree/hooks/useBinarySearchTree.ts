import { useRef, useState } from "react";
import { BinarySearchTree } from "../classes/BinarySearchTree";
import useAnimationBts from "../../tree/hooks/useTreeAnimaton";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import TreeLayout from "../../tree/_classes/TreeLayout";
import { TraversalType } from "../../tree/types";
import { speed } from "@/types";
import { toast } from "sonner";
import { createRandomUniqueArrayOfNumbers } from "@/lib/utils";
const MAX_TREE_SIZE = 200;
const MIN_INPUT_VALUE = -1000;
const MAX_INPUT_VALUE = 1000;
export const useBinarySearchTree = (speed: speed) => {
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
  } = useAnimationBts<number, BinaryTreeNode<number>>(treeLayout.tree, speed);

  const render = () => {
    setTreeLayout(new TreeLayout<number, BinaryTreeNode<number>>(binarySearchTree));

  };
  const clear = () => {
    binarySearchTree.clear();
    render();
  }
  const mock = async (arr: number[]) => {
    binarySearchTree.clear();
    for (let i = 0; i < arr.length; i++) {
      await binarySearchTree.insert(arr[i]);
    }
    render();
  };
  const createRandomTree = async (size: number) => {
    if (size > MAX_TREE_SIZE) {
      toast.error(`Tree size must be less than ${MAX_TREE_SIZE}`);
      return;
    };

    await mock(createRandomUniqueArrayOfNumbers(size, [MIN_INPUT_VALUE, MAX_INPUT_VALUE]))
  }
  const insert = async (data: number, onEnd = () => { }) => {
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
    const id = toast.loading(`Traversing: ${traverseType}`, {
      duration: Infinity
    })
    await binarySearchTree.traverse(traverseType, binarySearchTree.root, onTraversal);
    toast.dismiss(id);
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
    maxTreeSize: MAX_TREE_SIZE,
    minInputValue: MIN_INPUT_VALUE,
    maxInputValue: MAX_INPUT_VALUE
  };
};
