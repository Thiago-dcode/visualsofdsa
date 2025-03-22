import { Primitive } from "@/types";
import Node from "@/entities/data-structures/linear/_classes/Node";

export default abstract class TreeNode<T extends Primitive> extends Node<T> {
  // Core properties
  private _parent: TreeNode<T> | null = null;
  private _mod: number = 0;
  private _isLeftmost: boolean = false;
  private _isRightmost: boolean = false;
  private _isRoot: boolean = false;

  // Abstract property
  abstract get children(): TreeNode<T>[];

  get isLeaf(): boolean {
    return this.children.length === 0;
  }
  // Parent-related accessors
  get parent(): TreeNode<T> | null {
    return this._parent;
  }

  set parent(node: TreeNode<T>) {
    this._parent = node;
  }

  // Position flags
  get isLeftmost() {
    return this._isLeftmost;
  }

  get isRightmost() {
    return this._isRightmost;
  }

  set isLeftmost(value: boolean) {
    this._isLeftmost = value;
  }

  set isRightmost(value: boolean) {
    this._isRightmost = value;
  }

  // Sibling accessors
  get previousSibling(): TreeNode<T> | null {
    if (!this._parent) return null;
    const siblings = this._parent.children;
    const index = siblings.indexOf(this);
    return siblings[index - 1] || null;
  }

  get nextSibling(): TreeNode<T> | null {
    if (!this._parent) return null;
    const siblings = this._parent.children;
    const index = siblings.indexOf(this);
    return siblings[index + 1] || null;
  }

  get leftmostSibling(): TreeNode<T> | null {
    if (!this._parent) return null;
    const siblings = this._parent.children;
    return siblings[0] || null;
  }

  get rightmostSibling(): TreeNode<T> | null {
    if (!this._parent) return null;
    const siblings = this._parent.children;
    return siblings[siblings.length - 1] || null;
  }

  // Child accessors
  get leftmostChild(): TreeNode<T> | null {
    return this.children[0] || null;
  }

  get rightmostChild(): TreeNode<T> | null {
    return this.children[this.children.length - 1] || null;
  }

  // Layout property
  get mod() {
    return this._mod;
  }

  set mod(value: number) {
    this._mod = value;
  }

  get isRoot() {
    return this._isRoot;
  }

  set isRoot(value: boolean) {
    this._isRoot = value;
  }
}
