import { renderHook } from "@testing-library/react";
import useHeap from "../useHeap";
import LinkedList from "@/entities/data-structures/linear/linkedList/classes/LinkedList";
import NodeShape from "@/lib/classes/NodeShape";
import { act } from "react";
import Position from "@/lib/classes/Position";
import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import { Primitive } from "@/types";
import { ACTION } from "next/dist/client/components/app-router-headers";

describe("Testing useHeap", () => {
  const initialProps = {
    nodeShape: new LinkedList(),
  };
  const { nodeShape } = initialProps;
  it("Should set the inital positions", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(50);
    });
    const { row, col } = result.current.table;
    expect(result.current.freePositions.size).toBe(row * col);
    expect(result.current.width).toBe(
      col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) -
        nodeShape.nodeWidthSpacing
    );
    expect(result.current.height).toBe(
      row * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) -
        nodeShape.nodeHeightSpacing
    );
  });
  it("Should get the next free position", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    let currentCol = 0;
    let currentRow = 0;
    act(() => {
      result.current.malloc(100);
    });
    const { row, col } = result.current.table;
    for (let i = 0; i < col * row; i++) {
      const nextPosition = result.current.getNextFreePosition();

      if (nextPosition) {
        expect(nextPosition.position).toBeInstanceOf(Position);
        if (currentRow === 0) {
          expect(nextPosition.position.y).toBe(0);
        }
        if (i < 5) {
          expect(nextPosition.position.y).toBe(0);
        }
        expect(nextPosition.position.x).toBe(
          currentCol * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing)
        );
        expect(nextPosition.position.y).toBe(
          currentRow * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing)
        );
      }
      currentCol++;
      if (col === currentCol) {
        currentCol = 0;
        currentRow++;
      }
    }
    expect(result.current.freePositions.isEmpty).toBeTruthy();
  });
  it("Should set the next free position", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(100);
    });

    const { row, col } = result.current.table;
    const arrOfNodes: LinkedListNode<Primitive>[] = [];
    for (let i = 0; i < col * row; i++) {
      const nextPosition = result.current.getNextFreePosition();
      if (nextPosition)
        arrOfNodes.push(new LinkedListNode(i, nextPosition.position));
    }
    expect(arrOfNodes.length).toBe(col * row);

    for (let i = 0; i < arrOfNodes.length; i++) {
      result.current.setNextFreePosition(arrOfNodes[i]);
    }
    expect(result.current.freePositions.isFull).toBeTruthy();
    for (let i = 0; i < arrOfNodes.length; i++) {
      const nextPosition = result.current.getNextFreePosition();

      const node = arrOfNodes[i];
      expect(nextPosition).toBeTruthy();
      if (nextPosition) {
        const { position, memoryAddress } = nextPosition;
        expect(position.x).toBe(node.position.x);
        expect(position.y).toBe(node.position.y);
      }
    }
    expect(result.current.freePositions.isEmpty).toBeTruthy();
  });

  it("Should MALLOC", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(50);
    });
    expect(result.current.size).toBe(50);
    expect(result.current.freePositions.size).toBe(50);
    act(() => {
      result.current.malloc(10);
    });
    expect(result.current.size).toBe(10);
    expect(result.current.freePositions.size).toBe(10);
    act(() => {
      result.current.malloc(0);
    });
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
  });
  it("Should NOT MALLOC WITH WRONG SIZE", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(34234);
    });
    expect(result.current.error).toBeTruthy();
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
    act(() => {
      result.current.free();
    });
    expect(result.current.error).toBeFalsy();
    act(() => {
      result.current.malloc(-23);
    });
    expect(result.current.error).toBeTruthy();
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
  });

  it("SHOULD REALLOC", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(20);
    });

    act(() => {
      result.current.relloc(20);
    });
    expect(result.current.size).toBe(40);
    expect(
      result.current.table.col * result.current.table.row >= result.current.size
    ).toBeTruthy();
    expect(result.current.freePositions.size).toBe(40);
    act(() => {
      result.current.relloc(1);
    });
    expect(result.current.size).toBe(41);
    expect(
      result.current.table.col * result.current.table.row >= result.current.size
    ).toBeTruthy();
    expect(result.current.freePositions.size).toBe(41);
    act(() => {
      result.current.relloc(58);
    });
    expect(result.current.size).toBe(99);
    expect(result.current.freePositions.size).toBe(99);
    expect(result.current.table.col * result.current.table.row).toBe(100);
    act(() => {
      result.current.relloc(-10);
    });
    expect(result.current.size).toBe(89);
    expect(result.current.freePositions.size).toBe(89);
    act(() => {
      result.current.relloc(-1);
    });
    expect(result.current.size).toBe(88);
    expect(result.current.freePositions.size).toBe(88);
    act(() => {
      result.current.relloc(5);
    });
    expect(result.current.size).toBe(93);
    expect(result.current.freePositions.size).toBe(93);
    act(() => {
      result.current.relloc(-90);
    });
    expect(result.current.size).toBe(3);
    expect(result.current.freePositions.size).toBe(3);
    expect(result.current.table.col * result.current.table.row).toBe(3);
    act(() => {
      result.current.relloc(96);
    });
    expect(result.current.size).toBe(99);
    expect(result.current.freePositions.size).toBe(99);
    expect(result.current.table.col * result.current.table.row).toBe(100);
    act(() => {
      result.current.relloc(1);
    });
    expect(result.current.size).toBe(100);
    expect(result.current.freePositions.size).toBe(100);
    expect(result.current.table.col * result.current.table.row).toBe(100);
    act(() => {
      result.current.relloc(-100);
    });
    expect(result.current.error).toBeFalsy();
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
  });
  it("SHOULD REALLOC", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(20);
    });
    expect(result.current.size).toBe(20);
    act(() => {
      result.current.relloc(20);
    });
    expect(result.current.size).toBe(40);
    act(() => {
      result.current.relloc(20);
    });
    expect(result.current.size).toBe(60);
    act(() => {
      result.current.relloc(20);
    });
    expect(result.current.size).toBe(80);
    act(() => {
      result.current.relloc(20);
    });
    expect(result.current.size).toBe(100);
    act(() => {
      result.current.relloc(1);
    });
    act(() => {
      result.current.relloc(1);
    });
    act(() => {
      result.current.relloc(99);
    });
    expect(result.current.error).toBeTruthy();
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
    act(() => {
      result.current.free();
    });
    expect(result.current.error).toBeFalsy();
    act(() => {
      result.current.relloc(99);
    });
    expect(result.current.size).toBe(99);
    expect(result.current.freePositions.size).toBe(99);
    act(() => {
      result.current.relloc(-100);
    });
    expect(result.current.error).toBeTruthy();
    expect(result.current.size).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
  });

  it("should RESET", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    act(() => {
      result.current.malloc(50);
    });
    act(() => {
      result.current.free();
    });
    expect(result.current.size).toBe(0);
    expect(result.current.table.row).toBe(0);
    expect(result.current.table.col).toBe(0);
    expect(result.current.freePositions.size).toBe(0);
  });
});
