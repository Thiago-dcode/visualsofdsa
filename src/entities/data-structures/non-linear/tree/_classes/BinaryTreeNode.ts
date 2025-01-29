import Node from "@/entities/data-structures/linear/_classes/Node";
import { Primitive } from "@/types";

export default class BinaryTreeNode<T extends Primitive> extends Node<T> {
  left: BinaryTreeNode<T> | null = null;
  right: BinaryTreeNode<T> | null = null;
 
}
