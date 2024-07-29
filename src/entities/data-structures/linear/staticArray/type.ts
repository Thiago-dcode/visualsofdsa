import { Primitive } from "@/types";

export type staticArrayAction = "create" | "write" | "access" | "search" | "push";
export type searchResult = {
  steps: number;
  found: boolean;
  data: Primitive;
};
