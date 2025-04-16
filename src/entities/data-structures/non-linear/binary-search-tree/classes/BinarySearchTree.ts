import Position from "@/lib/classes/position/Position";
import BinaryTree from "../../tree/_classes/BinaryTree";
import BinaryTreeNode from "../../../non-linear/tree/_classes/BinaryTreeNode";
import {
  OnCompare,
  OnTraversal,
  OnRemove,
  OnFindSuccessor,
  Sortable
} from "../../../non-linear/tree/types";
import { Edge } from "@/lib/classes/Edge";

export class BinarySearchTree<T extends number> extends BinaryTree<T> implements Sortable<T,BinaryTreeNode<T>>{
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    const node = new BinaryTreeNode(data, new Position(0, 0), null);

    if (!this._root) {
      this._root = node;
      this._root.isRoot = true;
      this._size++;
      return this._root;
    }
    node.isRoot = false;
    const result = await this._insert(this._root, null, node, onCompare);
    if (result) this._size++;
    return result;
  }
  async insertNode(
    node: BinaryTreeNode<T>,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    if (!this._root) {
      this._root = node;
      this._root.isRoot = true;
      this._size++;
      return this._root;
    }
    node.isRoot = false;
    const result = await this._insert(this._root, null, node, onCompare);
    if (result) this._size++;
    return result;
  }

  async search(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    return await this._search(this._root, null, data, onCompare);
  }
  async remove(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    OnFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null,
    OnRemove: OnRemove<T, BinaryTreeNode<T>> | null = null
  ) {
    if (this._root && this._root.data === data) {
      const dummyParent = new BinaryTreeNode<T>(data);
      dummyParent.left = this._root;
      this._root.parent = dummyParent;

      await this._remove(
        dummyParent,
        data,
        onCompare,
        OnFindSuccessor,
        OnRemove
      );

      if (dummyParent.left) {
        this._root = dummyParent.left;
        this._root.parent = null;
        this._root.isRoot = true;
      } else {
        this._root = null;
      }
      this._size--;
      return true;
    }
    const result = await this._remove(
      this._root,
      data,
      onCompare,
      OnFindSuccessor,
      OnRemove
    );
    if (result) this._size--;
    return result;
  }
  private async _insert(
    node: BinaryTreeNode<T>,
    edge: Edge | null,
    nodeToInsert: BinaryTreeNode<T>,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    oppositeNode: BinaryTreeNode<T> | null = null
  ): Promise<BinaryTreeNode<T> | null> {
    node.isLastAdd = false;
    if (onCompare) await onCompare(node, edge, nodeToInsert.data, oppositeNode);
    if (node.data === nodeToInsert.data) return null;
    else {
      if (node.data < nodeToInsert.data) {
        if (!node.right) {
          node.right = nodeToInsert;
          node.right.parent = node;
          return node.right;
        }
        return await this._insert(
          node.right,
          node.rightEdge,
          nodeToInsert,
          onCompare,
          node.left
        );
      } else {
        if (!node.left) {
          node.left = nodeToInsert;
          node.left.parent = node;
          return node.left;
        }
        return await this._insert(
          node.left,
          node.leftEdge,
          nodeToInsert,
          onCompare,
          node.right
        );
      }
    }
  }

  private async _search(
    node: BinaryTreeNode<T> | null,
    edge: Edge | null,
    dataToSearch: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    oppoNode: BinaryTreeNode<T> | null = null
  ): Promise<BinaryTreeNode<T> | null> {
    if (onCompare && node) await onCompare(node, edge, dataToSearch, oppoNode);
    if (!node || node.data === dataToSearch) return node;
    if (dataToSearch > node.data) {
      return await this._search(
        node.right,
        node.rightEdge,
        dataToSearch,
        onCompare,
        node.left
      );
    } else {
      return await this._search(
        node.left,
        node.leftEdge,
        dataToSearch,
        onCompare,
        node.right
      );
    }
  }
  private async _remove(
    node: BinaryTreeNode<T> | null,
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    OnFindSuccessor: OnFindSuccessor<T, BinaryTreeNode<T>> | null = null,
    OnRemove: OnRemove<T, BinaryTreeNode<T>> | null = null,
    edge: Edge | null = null,
    oppoNode: BinaryTreeNode<T> | null = null,
    substituteNode: BinaryTreeNode<T> | null = null
  ): Promise<boolean> {
    if (!node) return false;
    if (onCompare) await onCompare(node, edge, data, oppoNode);
    const replaceNode = async (
      parent: BinaryTreeNode<T>,
      side: "left" | "right"
    ) => {
      //Case 1, no children
      if (!parent[side]?.children.length) {
        if (parent[side]) {
          if (OnRemove) await OnRemove(parent[side]);
          parent[side].isRoot = false;
        }
        parent[side] = null;
      }
      //case 2, 1 child
      else if (parent[side].left && !parent[side].right) {
        const oldNode = parent[side];
        if (OnRemove) await OnRemove(parent[side], parent[side].left);
        const leftChild = parent[side].left;
        parent[side] = leftChild;
        leftChild.parent = parent;
        oldNode.isRoot = false;
      } else if (!parent[side].left && parent[side].right) {
        const oldNode = parent[side];
        if (OnRemove) await OnRemove(parent[side], parent[side].right);
        const rightChild = parent[side].right;
        parent[side] = rightChild;
        rightChild.parent = parent;
        oldNode.isRoot = false;
      }
      //case 3, 2 children
      else {
        const nodeToRemove = parent[side];
        if (OnRemove) await OnRemove(nodeToRemove);

        // Find successor and remove it from its current position
        const successor = await this.findMinRightSubTree(
          nodeToRemove,
          OnFindSuccessor,
          true
        );

        if (OnRemove) await OnRemove(nodeToRemove, successor, true);

        // Store the old node's children
        const oldLeft = nodeToRemove.left;
        const oldRight = nodeToRemove.right;

        // First, set up successor's new relationships
        successor.parent = parent;
        parent[side] = successor;

        // Then restore the old node's children to the successor
        if (oldLeft !== successor) {
          successor.left = oldLeft;
          if (oldLeft) {
            oldLeft.parent = successor;
          }
        }
        if (oldRight !== successor) {
          successor.right = oldRight;
          if (oldRight) {
            oldRight.parent = successor;
          }
        }

        // Finally, clear the old node's references
        nodeToRemove.left = null;
        nodeToRemove.right = null;
        nodeToRemove.parent = null;
        nodeToRemove.isRoot = false;
      }
    };

    if (node.left && node.left.data === data) {
      await replaceNode(node, "left");
      return true;
    } else if (node.right && node.right.data === data) {
      await replaceNode(node, "right");
      return true;
    } else {
      if (data > node.data) {
        return await this._remove(
          node.right,
          data,
          onCompare,
          OnFindSuccessor,
          OnRemove,
          node.rightEdge,
          node.left,
          substituteNode
        );
      } else if (data < node.data) {
        return await this._remove(
          node.left,
          data,
          onCompare,
          OnFindSuccessor,
          OnRemove,
          node.leftEdge,
          node.right,
          substituteNode
        );
      }
    }
    return false;
  }

  private async findMinRightSubTree(
    parent: BinaryTreeNode<T>,
    onFindSuccessor: OnFindSuccessor<T, BinaryTreeNode<T>> | null = null,
    remove: boolean = false
  ): Promise<BinaryTreeNode<T>> {
    if (!parent.right) {
      throw new Error(
        "In order to use findMinRightSubTree, parent must have a right child"
      );
    }
    let pSuccessor = parent;
    let successor = parent.right;

    // Find the minimum value in the right subtree
    let isFirstCall = true;
    let isPreviousSuccessor = false;
    while (successor.left) {
      if (onFindSuccessor)
        await onFindSuccessor(
          successor,
          successor.leftEdge,
          isFirstCall,
          false
        );
      pSuccessor = successor;
      successor = successor.left;
   

      isFirstCall = false;
    }
    //Reset the edge between the parent and the successor since it is no longer a left edge
    //This is done because the successor is no longer the left child of the parent
    pSuccessor.leftEdge = new Edge();

    if (onFindSuccessor)
      await onFindSuccessor(successor, successor.leftEdge, isFirstCall, true);

    if (remove) {
      // Store successor's right child before clearing references
      const successorRight = successor.right;

      // Case 1: Successor is the immediate right child
      if (pSuccessor === parent) {
        parent.right = successorRight;
        if (successorRight) {
          successorRight.parent = parent;
        }
      }
      // Case 2: Successor is deeper in the tree
      else {
        pSuccessor.left = successorRight;
        if (successorRight) {
          successorRight.parent = pSuccessor;
        }
      }

      // Clear successor's references since it's being removed
      successor.left = null;
      successor.right = null;
      successor.parent = null;
      successor.isRoot = false;
    }

    return successor;
  }
get min(){
return this.leftMostNode()
}
get max(){
  return this.rightMostNode()
}
}
