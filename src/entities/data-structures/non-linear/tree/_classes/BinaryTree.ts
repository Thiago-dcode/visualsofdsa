import { Primitive } from "@/types";
import Tree from "./Tree";
import BinaryTreeNode from "./BinaryTreeNode";
import { OnCompare } from "../types";

export default class BinaryTree<T extends Primitive> extends Tree<
  T,
  BinaryTreeNode<T>
> {
  async insert(
    data: T,
    onCompare: OnCompare<T, BinaryTreeNode<T>>|null = null
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  remove(data: T, onCompare: OnCompare<T, BinaryTreeNode<T>>|null = null): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  search(data: T): Promise<BinaryTreeNode<T> | null> {
    throw new Error("Method not implemented.");
  }
  traversal(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
