import Node from "@/entities/data-structures/linear/_classes/Node";

 export type ClosureCompare = (a: Node<number>, b: Node<number>) => Promise<void>;
 export type ClosureSlice= (array: Node<number>[],side:'left'|'right') => Promise<void>;

 