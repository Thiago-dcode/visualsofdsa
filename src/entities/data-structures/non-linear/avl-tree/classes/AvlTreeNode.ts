import { Primitive } from "@/types";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";

export default class AvlTreeNode<T extends Primitive> extends BinaryTreeNode<T> {
  /** Height of the subtree rooted at this node. A leaf has height 1. */
  height = 1;

  static heightOf(node: BinaryTreeNode<Primitive> | null): number {
    return node instanceof AvlTreeNode ? node.height : 0;
  }

  get balanceFactor(): number {
    return AvlTreeNode.heightOf(this.left) - AvlTreeNode.heightOf(this.right);
  }

  updateHeight() {
    this.height = 1 + Math.max(AvlTreeNode.heightOf(this.left), AvlTreeNode.heightOf(this.right));
  }
}
