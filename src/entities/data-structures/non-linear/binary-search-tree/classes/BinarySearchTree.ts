import Position from "@/lib/classes/position/Position";
import BinaryTree from "../../tree/_classes/BinaryTree";
import BinaryTreeNode from "../../../non-linear/tree/_classes/BinaryTreeNode";
import { OnCompare, OnTraversal, OnRemove  } from "../../../non-linear/tree/types";
import { Edge } from "@/lib/classes/Edge";

export class BinarySearchTree<T extends number> extends BinaryTree<T> {
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    const node = new BinaryTreeNode(data, new Position(0, 0), null);

    if (!this._root) {
      this._root = node;
      this._root.isRoot = true;
      return this._root;
    }
    node.isRoot = false;
    return await this._insert(this._root, null, node, onCompare);
  }
  async insertNode(
    node: BinaryTreeNode<T>,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null
  ) {
    if (!this._root) {
      this._root = node;
      this._root.isRoot = true;
    }
    node.isRoot = false;
    return await this._insert(this._root, null, node, onCompare);
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
    OnRemove: OnRemove<T, BinaryTreeNode<T>> | null = null,
  ) {
    if (this._root && this._root.data === data) {
      if (!this._root.left && !this._root.right) {
        if (OnRemove) await OnRemove(this._root);
        this._root.isRoot = false;
        this._root = null;
      } else if (this._root.left && !this._root.right) {
        if (OnRemove) await OnRemove(this._root, this._root.left);
        this._root.data = this._root.left.data;
        this._root.isRoot = true;
        this._root.left = null;
      } else if (!this._root.left && this._root.right) {
        if (OnRemove) await OnRemove(this._root, this._root.right);
        this._root.data = this._root.right.data;
        this._root.isRoot = true;
        this._root.right = null;

      } else if (this._root.left && this._root.right) {
        const successor = await this.findMinRightSubTree(
          this._root,
          OnFindSuccessor,
          true
        );
        if (OnRemove) await OnRemove(this._root, successor);
        this._root.data = successor.data;
        this._root.isRoot = true;
      }
      return true;
    }
    return await this._remove(this._root, data, onCompare, OnFindSuccessor, OnRemove);
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
    OnFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null,
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
        parent[side].data = parent[side].left.data;
        parent[side].left = null;
        oldNode.isRoot = false;
      } else if (!parent[side].left && parent[side].right) {
        const oldNode = parent[side];
        if (OnRemove) await OnRemove(parent[side], parent[side].right);
        parent[side].data = parent[side].right.data;
        parent[side].right = null;
        oldNode.isRoot = false;
      }
      //case 3, 2 children
      else {
        const successor = await this.findMinRightSubTree(
          parent,
          OnFindSuccessor,
          true
        );
        const oldNode = parent[side];
        if (OnRemove) await OnRemove(parent[side], successor);
        parent[side].data = successor.data;
        oldNode.isRoot = false;
      }
    };

    if (node.left && node.left.data === data) {
      await replaceNode(node, "left");
      return true;
    }
    else if (node.right && node.right.data === data) {
      await replaceNode(node, "right");
      return true;
    } else {
     
      if (data > node.data) {
        return await this._remove(node.right, data,  onCompare, OnFindSuccessor, OnRemove, node.rightEdge, node.left, substituteNode);
      } else if (data < node.data) {
        return await this._remove(node.left, data,  onCompare, OnFindSuccessor, OnRemove, node.leftEdge, node.right, substituteNode);
      }
    }
    return false;
  }

  private async findMinRightSubTree(
    parent: BinaryTreeNode<T>,
    onFindSuccessor: OnTraversal<T, BinaryTreeNode<T>> | null = null,
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
      if (onFindSuccessor) await onFindSuccessor(successor,successor.leftEdge);
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
}
