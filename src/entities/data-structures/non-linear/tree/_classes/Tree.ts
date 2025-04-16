import { Primitive } from "@/types";

import { OnCompare, OnTraversal, TreeObj, TraversalType } from "../types";
import NodeShape from "@/lib/classes/NodeShape";
import TreeNode from "./TreeNode";
export default abstract class Tree<
  T extends Primitive,
  K extends TreeNode<T>
> extends NodeShape {
  protected _root: K | null = null;
  protected _size: number = 0;

  abstract insert(
    data: T,
    onCompare: OnCompare<T, K> | null
  ): Promise<K | null>;
  abstract remove(data: T, onCompare: OnCompare<T, K> | null): Promise<boolean>;
  abstract search(data: T): Promise<K | null>;
   abstract traverse(traverseType: TraversalType,branch?: K | null,onTraversal?: OnTraversal<T, K> | null): Promise<void>;
  abstract leftMostNode(branch: K | null): K | null;
  abstract rightMostNode(branch: K | null): K | null;
  abstract inOrderTraversal(
    branch: K | null,
    onTraversal: OnTraversal<T, K> | null
  ): Promise<void>;
  abstract preOrderTraversal(
    branch: K | null,
    onTraversal: OnTraversal<T, K> | null
  ): Promise<void>;
  abstract levelOrderTraversal(
    branch: K | null,
    onTraversal: OnTraversal<T, K> | null
  ): Promise<K[][]>;
  abstract postOrderTraversal(
    branch: K | null,
    onTraversal: OnTraversal<T, K> | null
  ): Promise<void>;
  abstract toTreeObj(): TreeObj<K> | null;
  clear() {
    this._root = null;
    this._size = 0;
  }
  get root() {
    return this._root;
  }
  get size() {
    return this._size;
  }
  set size(size: number) {
    this._size = size;
  }
}
