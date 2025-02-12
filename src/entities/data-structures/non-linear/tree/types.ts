import { Primitive } from "@/types";
import Node from "../../linear/_classes/Node";
import { Edge } from "@/lib/classes/Edge";

export type OnCompare<T extends Primitive, K extends Node<T>> = (
  nodeA: K,
  data: T
) => Promise<void>;

export type OnTraversal<T extends Primitive, K extends Node<T>> = (
  node: K
) => Promise<void>;

export type OnLevelInOrderTraversal<T extends Primitive, K extends Node<T>> = (
  node: K,
  level: number
) => Promise<void>;

export type TreeObj = {
  node: Node<Primitive>;
  edge: Edge | null;
  depth: number;
  children: TreeObj[];
};
