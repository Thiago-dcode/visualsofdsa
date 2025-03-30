import { Primitive } from "@/types";
import Node from "../../linear/_classes/Node";
import { Edge } from "@/lib/classes/Edge";

export type TraversalType = 'inOrder'| 'postOrder'| 'lvlOrder'| 'preOrder'

export type OnCompare<T extends Primitive, K extends Node<T>> = (
  nodeA: K,
  edge: Edge | null,
  data: T,
  oppositeNode?: K | null
) => Promise<void>;

export type OnTraversal<T extends Primitive, K extends Node<T>> = (
  node: K,
  edge?: Edge | null,
) => Promise<void>;
export type OnFindSuccessor<T extends Primitive, K extends Node<T>> = (
  node: K,
  edge?: Edge | null,
  isFirstCall?: boolean,
  found?: boolean,

) => Promise<void>;
export type OnRemove<T extends Primitive, K extends Node<T>> = (
  node: K,
  substituteNode?: K | null,
  isCaseThree?: boolean
) => Promise<void>;



export type OnLevelInOrderTraversal<T extends Primitive, K extends Node<T>> = (
  node: K,
  level: number
) => Promise<void>;

export type OnPostOrderTraversal<T extends Primitive, K extends Node<T>> = (
  node:K,
  siblings: K[],
) => Promise<void>;
export type TreeObj<T extends Node<Primitive>> = {
  node: T;
  edge: Edge | null;
  depth: number;
  parent: TreeObj<T> | null;
  children: TreeObj<T>[];
};


