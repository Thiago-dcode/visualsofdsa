import Node from "@/entities/data-structures/linear/_classes/Node";
import { Edge } from "@/lib/classes/Edge";
import { Primitive } from "@/types";

export default class BinaryTreeNode<T extends Primitive> extends Node<T> {
  left: BinaryTreeNode<T> | null = null;
  _leftEdge: Edge | null = null;
  right: BinaryTreeNode<T> | null = null;
  _rightEdge: Edge | null = null;
}
