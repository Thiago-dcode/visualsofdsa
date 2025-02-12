import Position from "@/lib/classes/position/Position";
import BinaryTree from "../../tree/_classes/BinaryTree";
import BinaryTreeNode from "../../../non-linear/tree/_classes/BinaryTreeNode";
import { OnCompare, OnTraversal } from "../../../non-linear/tree/types";

export class BinarySearchTree<T extends number> extends BinaryTree<T> {
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    const node = new BinaryTreeNode(data, new Position(0, 0), null);
    if (!this._root) {
      this._root = node;
    }
    await this._insert(this._root, node, onCompare);
  }
  async insertNode(
    node: BinaryTreeNode<T>,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    if (!this._root) {
      this._root = node;
    }
    this._insert(this._root, node, onCompare);
  }

  async search(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    return await this._search(this._root, data, onCompare);
  }
  async remove(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    OnFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ) {
    if (this._root && this._root.data === data) {
      if (!this._root.left && !this._root.right) this._root = null;
      else if (this._root.left && !this._root.right) {
        this._root.data = this._root.left.data;
        this._root.left = null;
      } else if (!this._root.left && this._root.right) {
        this._root.data = this._root.right.data;
        this._root.right = null;
      } else if (this._root.left && this._root.right) {
        //handle case 3
        const successor = await this.findMinRightSubTree(
          this._root,
          OnFindSuccessor,
          true
        );
        this._root.data = successor.data;
      }
      return true;
    }
    return await this._remove(this._root, data, onCompare);
  }
  private async _insert(
    node: BinaryTreeNode<T>,
    nodeToInsert: BinaryTreeNode<T>,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    if (onCompare) await onCompare(node, nodeToInsert.data);
    if (node.data === nodeToInsert.data) return;
    if (node.data < nodeToInsert.data) {
      if (!node.right) {
        node.right = nodeToInsert;
        return;
      }
      this._insert(node.right, nodeToInsert, onCompare);
    } else {
      if (!node.left) {
        node.left = nodeToInsert;
        return;
      }
      this._insert(node.left, nodeToInsert, onCompare);
    }
  }

  private async _search(
    node: BinaryTreeNode<T> | null,
    dataToSearch: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ): Promise<BinaryTreeNode<T> | null> {
    if (onCompare && node) await onCompare(node, dataToSearch);
    if (!node || node.data === dataToSearch) return node;
    if (dataToSearch > node.data) {
      return this._search(node.right, dataToSearch, onCompare);
    } else {
      return this._search(node.left, dataToSearch, onCompare);
    }
  }
  private async _remove(
    node: BinaryTreeNode<T> | null,
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    OnFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ): Promise<boolean> {
    if (!node) return false;

    const replaceNode = async (
      parent: BinaryTreeNode<T>,
      side: "left" | "right"
    ) => {
      //Case 1, no children
      if (!parent[side]?.left && !parent[side]?.right) parent[side] = null;
      //case 2, 1 child
      else if (parent[side].left && !parent[side].right) {
        parent[side].data = parent[side].left.data;
        parent[side].left = null;
      } else if (!parent[side].left && parent[side].right) {
        parent[side].data = parent[side].right.data;
        parent[side].right = null;
      }
      //case 3, 2 children
      else {
        const successor = await this.findMinRightSubTree(
          parent,
          OnFindSuccessor,
          true
        );
        parent[side].data = successor.data;
      }
    };

    if (data > node.data) {
      return this._remove(node.right, data, onCompare);
    } else if (data < node.data) {
      return this._remove(node.left, data, onCompare);
    } else {
      //left side:
      if (node.left && node.left.data === data) {
        await replaceNode(node.left, "left");
      }
      //right side:
      else if (node.right && node.right.data === data) {
        await replaceNode(node.right, "right");
      } else {
        return false;
      }
      return true;
    }
  }

  private async findMinRightSubTree(
    parent: BinaryTreeNode<T>,
    OnFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null,
    remove: boolean = false
  ): Promise<BinaryTreeNode<T>> {
    if (!parent.right) {
      throw new Error(
        "In order to use findMinRightSubTree, parent must have a right child"
      );
    }
    let pSuccessor = parent;
    let successor = parent.right;
    while (successor.left) {
      if (OnFindSuccessor) await OnFindSuccessor(successor);
      pSuccessor = successor;
      successor = successor.left;
    }
    if (remove) {
      if (pSuccessor.left === successor) {
        pSuccessor.left = successor.right;
      } else {
        pSuccessor.right = successor.right;
      }
    }
    return successor;
  }

  async inOrderTraversal(
    onTraversal: OnTraversal<T, BinaryTreeNode<T>> | null = null
  ) {
    const _traversal = async (node: BinaryTreeNode<T> | null) => {
      if (!node) return;

      await _traversal(node.left);
      if (onTraversal) await onTraversal(node);
      await _traversal(node.right);
    };
    await _traversal(this._root);
  }
}
