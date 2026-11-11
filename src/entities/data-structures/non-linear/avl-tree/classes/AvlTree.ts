import { Edge } from "@/lib/classes/Edge";
import Position from "@/lib/classes/position/Position";
import BinaryTree from "../../tree/_classes/BinaryTree";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import { OnCompare, OnFindSuccessor, OnRemove, Sortable } from "../../tree/types";
import { OnRotate } from "../types";
import AvlTreeNode from "./AvlTreeNode";

export class AvlTree<T extends number>
  extends BinaryTree<T>
  implements Sortable<T, BinaryTreeNode<T>>
{
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    onRotate: OnRotate<T> | null = null,
  ): Promise<AvlTreeNode<T> | null> {
    const node = new AvlTreeNode<T>(data, new Position(0, 0), null);
    if (!this._root) {
      this._root = node;
      node.isRoot = true;
      this._size++;
      return node;
    }

    let current = this.avl(this._root);
    let edge: Edge | null = null;
    let opposite: BinaryTreeNode<T> | null = null;
    while (current) {
      current.isLastAdd = false;
      if (onCompare) await onCompare(current, edge, data, opposite);
      if (current.data === data) return null;

      const goRight = current.data < data;
      const next = this.avl(goRight ? current.right : current.left);
      if (!next) {
        if (goRight) current.right = node;
        else current.left = node;
        node.parent = current;
        break;
      }
      edge = goRight ? current.rightEdge : current.leftEdge;
      opposite = goRight ? current.left : current.right;
      current = next;
    }

    this._size++;
    await this.rebalanceUp(this.avl(node.parent), onRotate);
    return node;
  }

  async search(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
  ): Promise<AvlTreeNode<T> | null> {
    let current = this.avl(this._root);
    let edge: Edge | null = null;
    let opposite: BinaryTreeNode<T> | null = null;
    while (current) {
      if (onCompare) await onCompare(current, edge, data, opposite);
      if (current.data === data) return current;
      const goRight = data > current.data;
      edge = goRight ? current.rightEdge : current.leftEdge;
      opposite = goRight ? current.left : current.right;
      current = this.avl(goRight ? current.right : current.left);
    }
    return null;
  }

  async remove(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>> | null = null,
    onFindSuccessor: OnFindSuccessor<T, BinaryTreeNode<T>> | null = null,
    onRemove: OnRemove<T, BinaryTreeNode<T>> | null = null,
    onRotate: OnRotate<T> | null = null,
  ): Promise<boolean> {
    let target = this.avl(this._root);
    let edge: Edge | null = null;
    let opposite: BinaryTreeNode<T> | null = null;
    while (target) {
      target.isLastAdd = false;
      if (onCompare) await onCompare(target, edge, data, opposite);
      if (target.data === data) break;
      const goRight = data > target.data;
      edge = goRight ? target.rightEdge : target.leftEdge;
      opposite = goRight ? target.left : target.right;
      target = this.avl(goRight ? target.right : target.left);
    }
    if (!target) return false;

    let start: AvlTreeNode<T> | null;
    if (target.left && target.right) {
      if (onRemove) await onRemove(target);
      const successor = await this.findSuccessor(target, onFindSuccessor);
      if (onRemove) await onRemove(target, successor, true);

      const successorParent = this.avl(successor.parent) as AvlTreeNode<T>;
      if (successorParent === target) {
        start = successor;
      } else {
        const successorRight = successor.right;
        successorParent.left = successorRight;
        if (successorRight) successorRight.parent = successorParent;
        this.resetEdges(successorParent);

        successor.right = target.right;
        target.right.parent = successor;
        start = successorParent;
      }
      successor.left = target.left;
      target.left.parent = successor;
      this.resetEdges(successor);
      this.replaceChild(target.parent, target, successor);
    } else {
      const child = target.left ?? target.right;
      if (onRemove) {
        if (child) await onRemove(target, child);
        else await onRemove(target);
      }
      start = this.avl(target.parent);
      this.replaceChild(target.parent, target, child);
    }

    target.left = null;
    target.right = null;
    target.parent = null;
    target.isRoot = false;
    this._size--;

    await this.rebalanceUp(start, onRotate);
    return true;
  }

  get min() {
    return this.leftMostNode();
  }

  get max() {
    return this.rightMostNode();
  }

  private avl(node: BinaryTreeNode<T> | null): AvlTreeNode<T> | null {
    return node as AvlTreeNode<T> | null;
  }

  private resetEdges(node: BinaryTreeNode<T>) {
    node.leftEdge = new Edge();
    node.rightEdge = new Edge();
  }

  /** Puts `replacement` where `old` sits under `parent` (or at the root when `parent` is null). */
  private replaceChild(
    parent: BinaryTreeNode<T> | null,
    old: BinaryTreeNode<T>,
    replacement: BinaryTreeNode<T> | null,
  ) {
    if (parent) {
      const wasLeft = parent.left === old;
      if (wasLeft) parent.left = replacement;
      else parent.right = replacement;
      if (replacement) {
        replacement.parent = parent;
        replacement.isRoot = false;
      }
      // The edge object belongs to the slot, but it now points at a different node.
      if (wasLeft) parent.leftEdge = new Edge();
      else parent.rightEdge = new Edge();
    } else {
      this._root = replacement;
      if (replacement) {
        replacement.parent = null;
        replacement.isRoot = true;
        replacement.isLeftmost = false;
        replacement.isRightmost = false;
      }
      old.isRoot = false;
    }
  }

  private async findSuccessor(
    target: AvlTreeNode<T>,
    onFindSuccessor: OnFindSuccessor<T, BinaryTreeNode<T>> | null,
  ): Promise<AvlTreeNode<T>> {
    let successor = this.avl(target.right) as AvlTreeNode<T>;
    let isFirstCall = true;
    while (successor.left) {
      if (onFindSuccessor) await onFindSuccessor(successor, successor.leftEdge, isFirstCall, false);
      successor = this.avl(successor.left) as AvlTreeNode<T>;
      isFirstCall = false;
    }
    if (onFindSuccessor) await onFindSuccessor(successor, successor.leftEdge, isFirstCall, true);
    return successor;
  }

  /** Walks from `start` to the root, refreshing heights and rotating where needed. */
  private async rebalanceUp(start: AvlTreeNode<T> | null, onRotate: OnRotate<T> | null) {
    let current = start;
    while (current) {
      const top = await this.rebalanceNode(current, onRotate);
      current = this.avl(top.parent);
    }
  }

  private async rebalanceNode(
    node: AvlTreeNode<T>,
    onRotate: OnRotate<T> | null,
  ): Promise<AvlTreeNode<T>> {
    node.updateHeight();
    const balance = node.balanceFactor;
    if (balance > 1) {
      const left = this.avl(node.left) as AvlTreeNode<T>;
      if (left.balanceFactor < 0) {
        this.rotate(left, "left");
        const top = this.rotate(node, "right");
        if (onRotate) await onRotate("left-right", node, top);
        return top;
      }
      const top = this.rotate(node, "right");
      if (onRotate) await onRotate("right", node, top);
      return top;
    }
    if (balance < -1) {
      const right = this.avl(node.right) as AvlTreeNode<T>;
      if (right.balanceFactor > 0) {
        this.rotate(right, "right");
        const top = this.rotate(node, "left");
        if (onRotate) await onRotate("right-left", node, top);
        return top;
      }
      const top = this.rotate(node, "left");
      if (onRotate) await onRotate("left", node, top);
      return top;
    }
    return node;
  }

  /** Rotates `x` down in the given direction and returns the node that took its place. */
  private rotate(x: AvlTreeNode<T>, direction: "left" | "right"): AvlTreeNode<T> {
    const goingUp = this.avl(direction === "left" ? x.right : x.left) as AvlTreeNode<T>;
    const inner = direction === "left" ? goingUp.left : goingUp.right;
    const grandParent = x.parent;

    if (direction === "left") {
      x.right = inner;
      goingUp.left = x;
    } else {
      x.left = inner;
      goingUp.right = x;
    }
    if (inner) inner.parent = x;
    x.parent = goingUp;
    this.replaceChild(grandParent, x, goingUp);

    this.resetEdges(x);
    this.resetEdges(goingUp);
    x.updateHeight();
    goingUp.updateHeight();
    return goingUp;
  }
}
