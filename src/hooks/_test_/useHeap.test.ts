import { renderHook } from "@testing-library/react";
import useHeap from "../useHeap";
import LinkedList from "@/entities/data-structures/linear/linkedList/classes/LinkedList";
import NodeShape from "@/lib/classes/NodeShape";
import { act } from "react";
import Position from "@/lib/classes/Position";
import LinkedListNode from "@/entities/data-structures/linear/linkedList/classes/LinkedListNode";
import { Primitive } from "@/types";

describe("Testing useHeap", () => {
  const initialProps = {
    nodeShape: new LinkedList(),
    col: 6,
    row: 5,
  };
  const { nodeShape, col, row } = initialProps;
  it("Should set the inital positions", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    expect(result.current.freePositions.size).toBe(row * col);
    expect(result.current.width).toBe(
      col * (nodeShape.nodeWidth + nodeShape.nodeWidthSpacing) - nodeShape.nodeWidthSpacing
    );
    expect(result.current.height).toBe(
      row * (nodeShape.nodeHeight + nodeShape.nodeHeightSpacing) - nodeShape.nodeHeightSpacing
    );
  });
  it("Should get the next free position", () => {
    const { result } = renderHook(useHeap, {
      initialProps,
    });
    let currentCol = 0;
    let currentRow = 0;

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
    const arrOfNodes: LinkedListNode<Primitive>[] = [];
    for (let i = 0; i < col * row; i++) {
      const nextPosition = result.current.getNextFreePosition();
      if (nextPosition) arrOfNodes.push(new LinkedListNode(i, nextPosition.position));
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
});
