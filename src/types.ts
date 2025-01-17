export type Primitive = number | string | null;
export type speed = 1 | 2 | 3 | 4;
export type Ref = HTMLElement | null;
export type onAnimationEnds = (
  e: AnimationEvent,
  ref: HTMLElement | null
) => void;
export type Direction = "ascending" | "descending";
export type listName = "linkedList" | "queue" | "stack";
export type ButtonActionType =
  | "read"
  | "write"
  | "delete"
  | "search"
  | "insert"
  | "fill";
export enum MemorySize {
  S = 40,
  M = 80,
  L = 120,
}
export type Position = {
  x: number;
  y: number;
};
export type VisualizationArrays = "memoryRam" | "bars";
