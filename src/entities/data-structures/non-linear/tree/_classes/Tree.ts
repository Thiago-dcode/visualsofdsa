import { Primitive } from "@/types";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { OnCompare, OnTraversal, TreeObj } from "../types";
import NodeShape from "@/lib/classes/NodeShape";

export default abstract class Tree<
  T extends Primitive,
  K extends Node<T>
> extends NodeShape {
  protected _root: K | null = null;

  abstract insert(data: T, onCompare: OnCompare<T, K> | null): Promise<void>;
  abstract remove(data: T, onCompare: OnCompare<T, K> | null): Promise<boolean>;
  abstract search(data: T): Promise<K | null>;
  abstract traversal(): Promise<void>;
  abstract levelOrderTraversal(
    onTraversal: OnTraversal<T, K> | null
  ): Promise<K[][]>;
  abstract toTreeObj(): TreeObj | null;
  clear() {
    this._root = null;
  }
  get root() {
    return this._root;
  }
}
