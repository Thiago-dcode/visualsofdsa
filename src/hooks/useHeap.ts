import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import Queue from "@/entities/data-structures/linear/queue/classes/Queue";
import NodeShape from "@/lib/classes/NodeShape";
import Position from "@/lib/classes/Position";
import { Primitive } from "@/types";
import { useCallback, useEffect, useMemo, useRef } from "react";

export default function useHeap({
  nodeShape,
  col = 6,
  row = 5,
}: {
  nodeShape: NodeShape;
  col?: number;
  row?: number;
}) {
  const heapSize = col * row;
  const freePositions = useRef(new Queue());
  const setInitialFreePositions = useCallback(() => {
    freePositions.current.maxSize = heapSize;
    let currentCol = 0;
    let currentRow = 0;
    for (let i = 0; i < heapSize; i++) {
      let firstColAdjustment = 0;
      freePositions.current.enqueue(
        new LinkedListNode(
          `${currentCol},${currentRow}`,
          new Position(
            currentCol * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing),
            currentRow * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)
          )
        )
      );
      currentCol++;
      if (col === currentCol) {
        currentCol = 0;
        currentRow++;
      }
    }
  }, [nodeShape, col, row]);
  const getNextFreePosition = () => {
    const node = freePositions.current.dequeueNode();

    return node ? node.position : null;
  };
  const setNextFreePosition = (node: LinkedListNode<Primitive>) => {
    if (freePositions.current.isFull) return;
    return freePositions.current.enqueue(node);
  };

   const width = 
    col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) -nodeShape.nodeWidthSpacing +7;
  const height = (row) * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)-nodeShape.nodeHeightSpacing +7;

  useEffect(() => {
    setInitialFreePositions();
  }, []);

  return {
    width,
    height,
    getNextFreePosition,
    setNextFreePosition,
    freePositions: freePositions.current,
  };
}
