import { Primitive } from "@/types";
import Tree from "./Tree";
import BinaryTreeNode from "./BinaryTreeNode";
import {
  OnCompare,
  OnPostOrderTraversal,
  OnTraversal,
  TreeObj,
} from "../types";
import { Edge } from "@/lib/classes/Edge";

export default class BinaryTree<T extends Primitive> extends Tree<
  T,
  BinaryTreeNode<T>
> {
 
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ): Promise<BinaryTreeNode<T> | null> {
    throw new Error("Method not implemented.");
  }
  remove(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  search(data: T): Promise<BinaryTreeNode<T> | null> {
    throw new Error("Method not implemented.");
  }
  traversal(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async inOrderTraversal(
    branch: BinaryTreeNode<T> | null = null,
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ) {
    const _traversal = async (node: BinaryTreeNode<T> | null) => {
      if (!node) return;

      await _traversal(node.left);
      if (onTraversal) await onTraversal(node);
      await _traversal(node.right);
    };
    await _traversal(branch || this._root);
  }
  async levelOrderTraversal(
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ): Promise<BinaryTreeNode<T>[][]> {
    if (!this.root) return [];

    const result: BinaryTreeNode<T>[][] = [];
    const queue: BinaryTreeNode<T>[] = [];

    queue.push(this.root);

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: BinaryTreeNode<T>[] = [];

      for (let i = 0; i < levelSize; i++) {
        const currentNode = queue.shift()!;
        currentLevel.push(currentNode);

        if (onTraversal) {
          await onTraversal(currentNode);
        }
        if (currentNode.left) {
          queue.push(currentNode.left);
        }
        if (currentNode.right) {
          queue.push(currentNode.right);
        }
      }

      result.push(currentLevel);
    }

    return result;
  }

  async postOrderTraversal(
    onTraversal: OnPostOrderTraversal<T, BinaryTreeNode<T>> | null = null
  ): Promise<BinaryTreeNode<T>[]> {
    const result: BinaryTreeNode<T>[] = [];

    const traverse = async (
      node: BinaryTreeNode<T> | null,
      parent: BinaryTreeNode<T> | null = null
    ) => {
      if (!node) return;

      await traverse(node.left, node);
      await traverse(node.right, node); 
      if (onTraversal) {
        onTraversal(node, this.getSiblings( parent));
      }
      result.push(node); 
    };

    await traverse(this.root);
    return result;
  }
  private getSiblings(
    parent: BinaryTreeNode<T> | null
  ): BinaryTreeNode<T>[] {
    if (!parent) return []; // Root has no siblings
    return [parent.left, parent.right].filter(
      (sibling) => sibling
    ) as BinaryTreeNode<T>[];
  }
  toTreeObj() {
    if (!this.root) return null;

    let maxDepth = 0;
    const treeObj = this.toTreeObjRec(this.root, null, null, 0, (depth) => {
      if (depth < maxDepth) maxDepth = depth;
    });
    return {
      maxDepth,
      treeObj,
    };
  }

  private toTreeObjRec(
    node: BinaryTreeNode<T>,
    parent: TreeObj<BinaryTreeNode<T>> | null = null,
    edge: Edge | null = null,
    depth = 0,
    onCall?: (depth: number) => void
  ): TreeObj<BinaryTreeNode<T>> {
    if (onCall) onCall(depth);
    const children: TreeObj<BinaryTreeNode<T>>[] = [];
    let _edge = edge;
    const treeObj = {
      node,
      parent,
      depth,
      edge: _edge,
      children,
    };

    if (node.left) {
      children.push(
        this.toTreeObjRec(node.left, treeObj, node.leftEdge, depth - 1, onCall)
      );
    }
    if (node.right) {
      children.push(
        this.toTreeObjRec(
          node.right,
          treeObj,
          node.rightEdge,
          depth - 1,
          onCall
        )
      );
    }
    return treeObj;
  }
}
