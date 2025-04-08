import { Primitive } from "@/types";
import Node from "../_classes/Node";
export type LinearDsActions = "add" | "remove" | "peek" | "fill" | "flush";
export type ArrayActions =
  | "create"
  | "write"
  | "access"
  | "search"
  | "push"
  | "insert"
  | "pop"
  | "delete"
  | "fill"
  | "";
export type searchResult = {
  steps: number;
  found: boolean;
  data: Primitive;
};

export type ArrayNodeWithKey = {
  node: Node<Primitive> | null;
  key: string;
};
