import { Primitive } from "@/types";
import type AvlTreeNode from "./classes/AvlTreeNode";

export type RotationType = "left" | "right" | "left-right" | "right-left";

/**
 * Fired once per rebalancing step, after the structure has been changed.
 * `pivot` is the node that was unbalanced, `newSubtreeRoot` is the node now sitting
 * at the pivot's old position.
 */
export type OnRotate<T extends Primitive> = (
  type: RotationType,
  pivot: AvlTreeNode<T>,
  newSubtreeRoot: AvlTreeNode<T>,
) => Promise<void>;
