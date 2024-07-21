import { Primitive } from "@/types";

export type staticArrayAction = "create" | "write" | "access" | "search";
export type searchResult = {
  steps: number;
  found: boolean;
  data: Primitive;
};
