import { Primitive } from "@/types";
import Tree from "./Tree";
import BinaryTreeNode from "./BinaryTreeNode";
import { OnCompare, OnTraversal, TreeObj } from "../types";
import { Edge } from "@/lib/classes/Edge";

export default class BinaryTree<T extends Primitive> extends Tree<
  T,
  BinaryTreeNode<T>
> {
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ): Promise<void> {
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
  toTreeObj() {
    if (!this.root) return null;

    return this.toTreeObjRec(this.root);
  }

  private toTreeObjRec(
    node: BinaryTreeNode<T>,
    edge: Edge | null = null,
    depth = 0
  ): TreeObj {
    const children: TreeObj[] = [];
    let _edge = edge;
    if (node.left) {
      children.push(this.toTreeObjRec(node.left, node.leftEdge, depth - 1));
    }
    if (node.right) {
      children.push(this.toTreeObjRec(node.right, node.rightEdge, depth - 1));
    }
    return {
      node,
      depth,
      edge: _edge,
      children,
    };
  }
}
