import { Primitive } from "@/types";

import { OnCompare, OnPostOrderTraversal, OnTraversal, TreeObj, TreeObjFull } from "../types";
import NodeShape from "@/lib/classes/NodeShape";
import TreeNode from "./TreeNode";
export default abstract class Tree<
  T extends Primitive,
  K extends TreeNode<T>
> extends NodeShape {
  protected _root: K | null = null;

  abstract insert(
    data: T,
    onCompare: OnCompare<T, K> | null
  ): Promise<K | null>;
  abstract remove(data: T, onCompare: OnCompare<T, K> | null): Promise<boolean>;
  abstract search(data: T): Promise<K | null>;
  abstract traversal(): Promise<void>;
  abstract inOrderTraversal(
    branch: K | null,
    onTraversal: OnTraversal<T, K> | null
  ): Promise<void>;
  abstract levelOrderTraversal(
    onTraversal: OnTraversal<T, K> | null
  ): Promise<K[][]>;
  abstract postOrderTraversal(
    onTraversal: OnPostOrderTraversal<T, K> | null
  ): Promise<K[]>;
  abstract toTreeObj(): TreeObjFull<K> | null;
  clear() {
    this._root = null;
  }
  get root() {
    return this._root;
  }
}
