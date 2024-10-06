import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import Queue from "@/entities/data-structures/linear/queue/classes/Queue";
import NodeShape from "@/lib/classes/NodeShape";
import Position from "@/lib/classes/Position";
import NotAllowedSizeError from "@/lib/errors/MaxSizeExceededError";
import { getMemoryAddress } from "@/lib/utils";
import { Primitive } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
const MAX_COL = 5;
const MAX_SIZE = 100;
type Error = {
  name: string;
  description: string;
};
type Table = {
  row: number;
  col: number;
};
export type Heap = {
  width: number;
  height: number;
  getNextFreePosition: () => {
    position: Position;
    memoryAddress: string;
  } | null;
  setNextFreePosition: (node: LinkedListNode<Primitive>) => void;
  freePositions: Queue<Primitive>;
  error: Error | null;
  reset: (heapSize?: number | null) => void;
  size: number;
  freeSpace: number;
  malloc: (heapSize: number) => void;
  table: Table;
};

export default function useHeap({ nodeShape }: { nodeShape: NodeShape }): Heap {
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const freePositions = useRef(new Queue());
  const [table, setTable] = useState({
    row: 0,
    col: 0,
  });
  const { row, col } = table;
  const [freeSpace, setFreeSpace] = useState(0);
  const _heapSize = col * row;
  const setInitialFreePositions = useCallback(() => {
    freePositions.current.flush();
    try {
      freePositions.current.maxSize = _heapSize;
    } catch (error) {
      if (error instanceof NotAllowedSizeError) {
        return;
      }
    }
    let currentCol = 0;
    let currentRow = 0;
    for (let i = 0; i < _heapSize; i++) {
      const node = new LinkedListNode(
        `${currentRow + 1},${currentCol + 1}`,
        new Position(
          currentCol * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing),
          currentRow * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)
        )
      );
      node.memoryAddress = getMemoryAddress(i);
      freePositions.current.enqueue(node);
      currentCol++;
      if (col === currentCol) {
        currentCol = 0;
        currentRow++;
      }
    }
    setFreeSpace(freePositions.current.size);
  }, [table]);

  const reset = (heapSize: number | null = null) => {
    if (heapSize !== null) handleSetTable(heapSize);
    setInitialFreePositions();
    setError(null);
  };
  const getNextFreePosition = () => {
    if (freePositions.current.isEmpty) {
      setError({
        name: "HeapOverFlowException",
        description: `A Heap overflow error has ocurred. Heap maximum size of ${_heapSize} nodes exceeded.`,
      });
      return null;
    }
    const node = freePositions.current.dequeueNode();
    setFreeSpace(freePositions.current.size);

    return node
      ? {
          position: node.position,
          memoryAddress: node.memoryAddress,
        }
      : null;
  };
  const setNextFreePosition = (node: LinkedListNode<Primitive>) => {
    if (freePositions.current.isFull) return;
    setFreeSpace(freePositions.current.size);
    const newNode = new LinkedListNode(``, node.position);
    newNode.memoryAddress = node.memoryAddress;
    return freePositions.current.enqueue(newNode);
  };

  const width =
    col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) -
    nodeShape.nodeWidthSpacing;
  const height =
    row * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) -
    nodeShape.nodeHeightSpacing;
  const handleSetTable = (heapSize: number) => {
    if (heapSize <= 0 || heapSize > MAX_SIZE) {
      setError({
        description: `Invalid heap size, max size allowed: ${MAX_SIZE} `,
        name: "HeapSizeError",
      });
      setTable({
        row: 0,
        col: 0,
      });
      return;
    }
    let col = Math.min(heapSize, MAX_COL);
    let row = Math.ceil(heapSize / col);
    setTable({
      row,
      col,
    });
  };
  const malloc = (heapSize: number) => {
    handleSetTable(heapSize);
  };
  useEffect(() => {
    if (!row || !col) {
      return;
    }
    setInitialFreePositions();
  }, [table]);
  useEffect(() => {}, []);
  return {
    width,
    height,
    getNextFreePosition,
    setNextFreePosition,
    freePositions: freePositions.current,
    error,
    reset,
    size: _heapSize,
    freeSpace,
    malloc,
    table,
  };
}
