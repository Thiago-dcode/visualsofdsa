import LinkedListNode from "@/entities/data-structures/linear/linked-list/classes/LinkedListNode";
import Queue from "@/entities/data-structures/linear/queue/classes/Queue";
import NodeShape from "@/lib/classes/NodeShape";
import Position from "@/lib/classes/position/Position";
import NotAllowedSizeError from "@/lib/errors/MaxSizeExceededError";
import { getMemoryAddress } from "@/lib/utils";
import { Primitive } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useResponsive from "./useResponsive";
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

export default function useHeap({
  nodeShape,
  onFree,
}: {
  nodeShape: NodeShape;
  onFree?: () => void;
}): Heap {
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const freePositions = useRef(new Queue());
  const device = useResponsive(() => {
    free();
  });
  freePositions.current.maxSize = MAX_SIZE;
  const table = useRef({
    row: 0,
    col: 0,
  });
  const [heapSize, setHeapSize] = useState(0);
  const [freeSpace, setFreeSpace] = useState(0);
  const currentRow = useRef(0);
  const currentCol = useRef(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const allocateMemory = (size: number) => {
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

    setFreeSpace(freePositions.current.size);
  };

  const reset = () => {
    freePositions.current.flush();
    setFreeSpace(0);
    currentRow.current = 0;
    currentCol.current = 0;
    table.current = {
      row: 0,
      col: 0,
    };
  };
  const free = () => {
    setError(null);
    setHeapSize(0);
    setWidth(0);
    setHeight(0);
    reset();
    if (onFree) onFree();
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
    if (error) return;
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
    const {max_col} = setDimensionsBasingOnScreenWidth();
    let col = Math.min(heapSize, Math.min(10,max_col));
    let row = Math.ceil(heapSize / col);
    setHeapSize(heapSize);
    setWidth(
      col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) -
        nodeShape.nodeWidthSpacing
    );
    setHeight(
      row * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) -
        nodeShape.nodeHeightSpacing
    );
    table.current = {
      row,
      col,
    };
    return true;
  };
  const setDimensionsBasingOnScreenWidth = () => {
  return  {max_col: Math.floor(
      device.width / (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing)
    )}
  };
  const malloc = (heapSize: number) => {
    reset();
    if (handleSetTable(heapSize)) allocateMemory(heapSize);
  };
  const relloc = (size: number) => {
    if (handleSetTable(heapSize + size)) allocateMemory(size);
  };

  return {
    width,
    height,
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
