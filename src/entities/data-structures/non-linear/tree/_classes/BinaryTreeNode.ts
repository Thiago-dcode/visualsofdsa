import TreeNode from "./TreeNode";
import { Edge } from "@/lib/classes/Edge";
import Position from "@/lib/classes/position/Position";
import { Primitive, Ref } from "@/types";

export default class BinaryTreeNode<T extends Primitive> extends TreeNode<T> {
  protected _left: BinaryTreeNode<T> | null = null;
  protected _leftEdge: Edge;
  protected _right: BinaryTreeNode<T> | null = null;
  protected _rightEdge: Edge;
  protected _parent: BinaryTreeNode<T> | null = null;
  constructor(
    data: T,
    position: Position = new Position(0, 0),
    ref: Ref = null,
    color: string = ""
  ) {
    super(data, position, ref, color);
    this._leftEdge = new Edge();
    this._rightEdge = new Edge();
  }
   // Parent-related accessors
   get parent(): BinaryTreeNode<T> | null {
    return this._parent;
  }

  set parent(node: BinaryTreeNode<T> | null) {
    this._parent = node;
  }

  get left() {
   
    return this._left;
  }
  get right() {
   
    return this._right;
  }
  set left(node: BinaryTreeNode<T> | null) {
    this._left = node;
    if (this._left) {
      this._left.isLeftmost = true;
      this._left.isRightmost = false;
    }
  }
  set right(node: BinaryTreeNode<T> | null) {
    this._right = node;
    if (this._right) {
      this._right.isRightmost = true;
      this._right.isLeftmost = false;
    }
  }
  get leftEdge() {
    return this._leftEdge;
  }
  get rightEdge() {
    return this._rightEdge;
  }
  set leftEdge(edge: Edge) {
    this._leftEdge = edge;
  }
  set rightEdge(edge: Edge) {
    this._rightEdge = edge;
  }
  get children(): BinaryTreeNode<T>[] {
    return [this.left, this.right].filter((child) => child) as BinaryTreeNode<T>[];
  } 
  getPreviousSibling(): BinaryTreeNode<T> | null {
    return null;
  }
  getNextSibling(): BinaryTreeNode<T> | null {
    return null;
  } 
  getParent(): BinaryTreeNode<T> | null {
    return null;
  }
  getLeftmostSibling(): BinaryTreeNode<T> | null {
    return null;
  }
  getRightmostSibling(): BinaryTreeNode<T> | null {
    return null;
  }
  getLeftmostChild(): BinaryTreeNode<T> | null {
    return null;
  }       
  

}
