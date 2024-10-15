import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import { Primitive, Ref } from "@/types";
import { getEuclideanDistance, getAngle } from "../utils";
import NodeShape from "./NodeShape";
import { requestAnimation } from "@/lib/utils";
export class Edge {
  constructor(
    public ref: Ref = null,
    public x: number = 0,
    public y: number = 0,
    public length: number = 0,
    public angle: number = 0
  ) {}

  public resetShape () {
    this.x = 0;
    this.y = 0;
    this.length = 0;
    this.angle = 0;
  }
  public setShape(
    nodeStart: LinkedListNode<Primitive> | null,
    nodeEnd: LinkedListNode<Primitive> | null,
    nodeShape: NodeShape
  ) {
    if (!nodeStart || !nodeEnd) {
      return;
    }
    const nodeStartPosition = {
      x: nodeStart.position.x + nodeShape.nodeWidth,
      y: nodeStart.position.y + nodeShape.nodeHeight / 2,
    };
    const nodeNextPosition = {
      x: nodeEnd.position.x,
      y: nodeEnd.position.y + nodeShape.nodeHeight / 2,
    };

    const length = getEuclideanDistance(nodeStartPosition, nodeNextPosition);

    const angle = getAngle(nodeStartPosition, nodeNextPosition);

    (this.x = nodeShape.nodeWidth),
      (this.y = nodeShape.nodeHeight / 2),
      (this.length = length),
      (this.angle = angle);
  }
  get shape() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
      length: this.length,
    };
  }
}

export const animateEdge = async (
  edge: Edge | null,
  animation = `animate-edge ${1 + "s"}`,
  onAnimationEnds: ((e: AnimationEvent) => void) | null = null
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (edge === null || edge.ref === null) {
      reject(false);
    } else {
      const animationEvent = (e: AnimationEvent) => {
        if (onAnimationEnds) {
          onAnimationEnds(e);
        }

        if (edge.ref)
          edge.ref.removeEventListener("animationend", animationEvent);

        resolve(true);
      };
      requestAnimation(edge.ref, animation, animationEvent);
    }
  });
};

export default animateEdge;
