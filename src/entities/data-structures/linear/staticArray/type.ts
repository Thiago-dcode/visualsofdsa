import { Primitive } from "@/types";

export type ArrayActions = "create" | "write" | "access" | "search" | "push" |'insert';
export type searchResult = {
  steps: number;
  found: boolean;
  data: Primitive;
};
