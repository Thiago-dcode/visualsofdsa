import { Primitive } from "@/types";
import Tree from "./Tree";
import BinaryTreeNode from "./BinaryTreeNode";
import {
  OnCompare,
  OnTraversal,
  TraversalType,
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
 async traverse( traverseType: TraversalType,branch: BinaryTreeNode<T> | null = null,onTraversal?: OnTraversal<T, BinaryTreeNode<T>> | null): Promise<void> {
  if (!branch) return;

  if(traverseType ==='lvlOrder'){
    await this.levelOrderTraversal(branch,onTraversal);
    return;
  }
  if (onTraversal && traverseType ==='preOrder') await onTraversal(branch);
  await this.traverse(traverseType,branch.left,onTraversal);
  if (onTraversal && traverseType ==='inOrder') await onTraversal(branch);
  await this.traverse(traverseType,branch.right,onTraversal);
  if (onTraversal && traverseType ==='postOrder') await onTraversal(branch);
}

async preOrderTraversal(
  branch: BinaryTreeNode<T> | null = null,
  onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
) {

  await this.traverse('preOrder',branch,onTraversal);
}
  async inOrderTraversal(
    branch: BinaryTreeNode<T> | null = null,
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ) {
  
    await this.traverse('inOrder',branch,onTraversal);
  }
  leftMostNode(branch: BinaryTreeNode<T> | null = this._root): BinaryTreeNode<T> | null {
    if (!branch) return null;
    while (branch.left) {
      branch = branch.left;
    }
    return branch;
  }
  rightMostNode(branch: BinaryTreeNode<T> | null = this._root): BinaryTreeNode<T> | null {
    if (!branch) return null;
    while (branch.right) {
      branch = branch.right;
    }
    return branch;
  }
  async levelOrderTraversal(
    branch: BinaryTreeNode<T> | null = null,
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ): Promise<BinaryTreeNode<T>[][]> {
    const _branch = branch || this.root;
    if (!_branch) return [];

    const result: BinaryTreeNode<T>[][] = [];
    const queue: BinaryTreeNode<T>[] = [];

    queue.push(_branch);

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
    branch: BinaryTreeNode<T> | null = null,
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ): Promise<void> {
  

    await this.traverse('postOrder',branch,onTraversal);
  
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

   return this.toTreeObjRec(this.root, null, null, 0);
   
  }

  private toTreeObjRec(
    node: BinaryTreeNode<T>,
    parent: TreeObj<BinaryTreeNode<T>> | null = null,
    edge: Edge | null = null,
    depth = 0,
    
  ): TreeObj<BinaryTreeNode<T>> {

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
        this.toTreeObjRec(node.left, treeObj, node.leftEdge, depth + 1)
      );
    }
    if (node.right) {
      children.push(
        this.toTreeObjRec(
          node.right,
          treeObj,
          node.rightEdge,
          depth + 1,
          
        )
      );
    }
    return treeObj;
  }
}
