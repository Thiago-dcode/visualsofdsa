import { Primitive, Ref } from "@/types";
import { getEuclideanDistance, getAngle } from "../utils";
import NodeShape from "./NodeShape";
import Node from "@/entities/data-structures/linear/_classes/Node";

export class Edge {
  constructor(
    public ref: Ref = null,
    public x: number = 0,
    public y: number = 0,
    public length: number = 0,
    public angle: number = 0
  ) {}

  public resetShape() {
    this.x = 0;
    this.y = 0;
    this.length = 0;
    this.angle = 0;
  }
  public setShapeByPosition(
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    this.x = start.x;
    this.y = start.y;
    this.length = getEuclideanDistance(start, end);
    this.angle = getAngle(start, end);
  }
  public setShape(
    nodeStart: Node<Primitive> | null,
    nodeEnd: Node<Primitive> | null,
    nodeShape: NodeShape,
    extraHeight = 0,
    extraWidth = 0
  ) {
    if (!nodeStart || !nodeEnd) {
      return;
    }
    const nodeStartPosition = {
      x: nodeStart.position.x,
      y: nodeStart.position.y + nodeShape.nodeHeight / 2,
    };
    const nodeNextPosition = {
      x: nodeEnd.position.x,
      y: nodeEnd.position.y + nodeShape.nodeHeight / 2,
    };

    const length = getEuclideanDistance(nodeStartPosition, nodeNextPosition);

    const angle = getAngle(nodeStartPosition, nodeNextPosition);

    this.x = 0;
    this.y = nodeShape.nodeHeight / 2;
    this.length = length;
    this.angle = angle;
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
