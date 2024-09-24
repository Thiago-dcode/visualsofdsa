import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import Queue from "@/entities/data-structures/linear/queue/classes/Queue";
import NodeShape from "@/lib/classes/NodeShape";
import Position from "@/lib/classes/Position";
import { getMemoryAddress } from "@/lib/utils";
import { Primitive } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useHeap({
  nodeShape,
  col = 6,
  row = 5,
}: {
  nodeShape: NodeShape;
  col?: number;
  row?: number;
}) {
  const [error, setError] = useState<{
    name: string,
    description: string

  } | null>(null)

  
  const freePositions = useRef(new Queue());
  const [freeSpace,setFreeSpace] = useState(0)
  const _heapSize = useRef(col * row);
  const setInitialFreePositions = useCallback(() => {
    freePositions.current.flush()
    freePositions.current.maxSize = _heapSize.current;
    let currentCol = 0;
    let currentRow = 0;
    for (let i = 0; i < _heapSize.current; i++) {
      const node = new LinkedListNode(
        `${currentRow + 1},${currentCol + 1}`,
        new Position(
          currentCol * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing),
          currentRow * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)
        )
      );
      node.memoryAddress = getMemoryAddress(i)
      freePositions.current.enqueue(node);
      currentCol++;
      if (col === currentCol) {
        currentCol = 0;
        currentRow++;
      }
    }
    setFreeSpace(freePositions.current.size)
  }, [nodeShape, col, row]);

  const reset = (heapSize: number | null = null) => {
    if (heapSize !== null) _heapSize.current = heapSize;
    setInitialFreePositions();
    setError(null);

  }
  const getNextFreePosition = () => {
    
    if (freePositions.current.isEmpty) {
      setError({
        name: 'HeapOverFlowException',
        description: `A Heap overflow error has ocurred. Heap maximum size of ${col * row} nodes exceeded.`,
      })
      return;
    };
    const node = freePositions.current.dequeueNode();
    setFreeSpace(freePositions.current.size)

    return node ? {
      position: node.position,
      memoryAddress: node.memoryAddress
    } : null;
  };
  const setNextFreePosition = (node: LinkedListNode<Primitive>) => {
    if (freePositions.current.isFull) return;
    setFreeSpace(freePositions.current.size)
    return freePositions.current.enqueue(node);
  };

  const width =
    col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) - nodeShape.nodeWidthSpacing;
  const height = (row) * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) - nodeShape.nodeHeightSpacing;

  useEffect(() => {
    setInitialFreePositions();
  }, []);

  return {
    width,
    height,
    getNextFreePosition,
    setNextFreePosition,
    freePositions: freePositions.current,
    error,
    reset,
    size: _heapSize.current,
    freeSpace
  
  };
}
