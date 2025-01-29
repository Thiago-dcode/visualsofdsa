import { Primitive } from "@/types";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { OnCompare } from "../types";

export default abstract class Tree<T extends Primitive, K extends Node<T>> {
  protected _root: K | null = null;

  abstract insert(data: T, onCompare: OnCompare<T, K> | null): Promise<void>;
  abstract remove(data: T, onCompare: OnCompare<T, K> | null): Promise<boolean>;
  abstract search(data: T): Promise<K | null>;
  abstract traversal(): Promise<void>;
  clear() {
    this._root = null;
  }
  get root() {
    return this._root;
  }
}
