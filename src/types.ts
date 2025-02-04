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

export type Implementation = {
  id: number;
  javaScript?: string;
  java?: string;
};
export type EntityBase = {
  id: number;
  name: string;
  enable: boolean;
  description: string | null;
  link: string;
};
export type EntitySimple = {
  name: string;
  enable: boolean;
  link: string;
};
export type EntityWithType = EntityBase & {
  type: EntityBase;
};
export type EntityWithImplementation = EntityBase & {
  implementation?: Implementation;
};
export type EntityFull = EntityWithType & EntityWithImplementation;
export type EntityType = EntityBase & {
  children: EntityWithType[];
  description: string;
};
export type EntityTypeSimple = EntitySimple & {
  children: EntitySimple[];
};

export type Entities = "data-structures" | "algorithms";
