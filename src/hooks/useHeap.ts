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
  free: () => void;
  size: number;
  freeSpace: number;
  malloc: (heapSize: number) => void;
  relloc: (size: number) => void;
  table: Table;
};

export default function useHeap({ nodeShape }: { nodeShape: NodeShape }): Heap {
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const freePositions = useRef(new Queue());
  freePositions.current.maxSize = MAX_SIZE;
  const table = useRef({
    row: 0,
    col: 0,
  });
  const [heapSize, setHeapSize] = useState(0);
  const [freeSpace, setFreeSpace] = useState(0);
  const currentRow = useRef(0);
  const currentCol = useRef(0);
  const allocateMemory = (size: number) => {
    if (size >= 0) {
      for (let i = 0; i < size; i++) {
        const node = new LinkedListNode(
          `${currentRow.current + 1},${currentCol.current + 1}`,
          new Position(
            currentCol.current *
              (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing),
            currentRow.current *
              (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)
          )
        );
        node.memoryAddress = getMemoryAddress(i);
        freePositions.current.enqueue(node);
        currentCol.current++;
        if (table.current.col === currentCol.current) {
          currentCol.current = 0;
          currentRow.current++;
        }
      }
    } else {
      for (let i = 0; i > size; i--) {
        if (currentCol.current === 0) {
          currentCol.current = table.current.col;
          currentRow.current--;
        }
        freePositions.current.dequeue();
        currentCol.current--;
      }
    }

    setFreeSpace(freePositions.current.size);
  };

  const reset = () => {
    freePositions.current.flush();
    currentRow.current = 0;
    currentCol.current = 0;
    table.current = {
      row: 0,
      col: 0,
    };
  };
  const free = () => {
    setError(null);
    handleSetTable(0);
  };
  const getNextFreePosition = () => {
    if (freePositions.current.isEmpty) {
      setError({
        name: "HeapOverFlowException",
        description: `A Heap overflow error has ocurred. Heap maximum size of ${heapSize} nodes exceeded.`,
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
    if (freePositions.current.size === heapSize) return;
    setFreeSpace(freePositions.current.size);
    const newNode = new LinkedListNode(``, node.position);
    newNode.memoryAddress = node.memoryAddress;
    const _node = freePositions.current.enqueue(newNode);
    setFreeSpace(freePositions.current.size);
    return _node;
  };

  const handleSetTable = (heapSize: number) => {
    if (error) return false;
    if (heapSize <= 0 || heapSize > MAX_SIZE) {
      if (heapSize !== 0) {
        setError({
          description: `Invalid heap size, max size allowed: ${MAX_SIZE} `,
          name: "HeapSizeError",
        });
      }
      reset();
      setHeapSize(0);

      return false;
    }
    let col = Math.min(heapSize, MAX_COL);
    let row = Math.ceil(heapSize / col);
    setHeapSize(heapSize);
    table.current = {
      row,
      col,
    };
    return true;
  };
  const malloc = (heapSize: number) => {
    reset();
    if (handleSetTable(heapSize)) allocateMemory(heapSize);
  };
  const relloc = (size: number) => {
    if (handleSetTable(heapSize + size)) allocateMemory(size);
  };

  return {
    width:
      table.current.col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) -
      nodeShape.nodeWidthSpacing,
    height:
      table.current.row * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) -
      nodeShape.nodeHeightSpacing,
    getNextFreePosition,
    setNextFreePosition,
    freePositions: freePositions.current,
    error,
    free,
    size: heapSize,
    freeSpace,
    malloc,
    relloc,
    table: table.current,
  };
}
