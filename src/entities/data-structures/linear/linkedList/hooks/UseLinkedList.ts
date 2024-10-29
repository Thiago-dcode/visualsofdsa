import React, { useEffect, useState } from "react";
import LinkedList from "../classes/LinkedList";
import { Primitive } from "@/types";
import Position from "@/lib/classes/Position";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { toast } from "sonner";
import "../style.css";
import UseLinkedListAnimation from "./UseLinkedListAnimation";
import LinkedListNode from "../classes/LinkedListNode";
import { animate } from "@/lib/animations";
const ANIMATION_SPEED = 1;
export default function UseLinkedList(isDoublyLinkedList = false) {
  const [linkedList, setLinkedList] = useState(new LinkedList());
  const { getAnimation } = UseLinkedListAnimation(linkedList);

  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const [arrayLs, setArrayLs] = useState(linkedList.toNodeArray());
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);

  const animateEdge = (ref: HTMLElement | null) =>
    animate(ref, `lit-node-edge ${ANIMATION_SPEED * 0.5}s`);
  const add = async (
    data: Primitive,
    index: number,
    position = new Position(0, 0),
    memoryAddress: string = ""
  ) => {
    try {
      let steps = index + 1;
      if (!isDoublyLinkedList && index > 0) await findNode(index - 1, false);

      const node = await linkedList.add(
        data,
        index,
        position,
        async (_node, _index, direction, _steps) => {
          if (!_node || !isDoublyLinkedList) return;

          steps = _steps || 1;
          try {
            if (_node && _node.ref) {
              await animate(
                _node.ref,
                `find-node ${ANIMATION_SPEED * 0.8 + "s"}`
              );

              if (direction === "forward")
                await animateEdge(_node.nextEdge.ref);
              else if (direction === "backward")
                await animateEdge(_node.prevEdge.ref);
            }
          } catch (error) {}
        }
      );

      node.memoryAddress = memoryAddress;
      node.isLastAdd = true;

      setArrayLs(linkedList.toNodeArray());
      toast.info(` Took ${steps} steps to add a new node`, {
        position: "top-center",
      });
      return node;
    } catch (error) {
      if (error instanceof IndexOutOfBoundsError) {
        setError({
          name: "IndexOutOfTheBoundException",
          description: `Index ${index} out of bounds for length ${linkedList.size}`,
        });
      }
    }
  };

  const del = async (index: number) => {
    try {
      let node: LinkedListNode<Primitive> | null = null;
      let steps = index + 1;
      if (!isDoublyLinkedList) await findNode(index, true, true);

      node = await linkedList.deleteAndGetNode(
        index,
        async (_node, _index, direction, _steps) => {
          if (!_node || !isDoublyLinkedList) return;

          steps = _steps || 1;
          try {
            if (_node && _node.ref) {
              await animate(
                _node.ref,
                `${index !== _index?"find":'del'}-node ${ANIMATION_SPEED * 0.8 + "s"}`
              );

              if (index !== _index) {
                if (direction === "forward")
                  await animateEdge(_node.nextEdge.ref);
                else if (direction === "backward")
                  await animateEdge(_node.prevEdge.ref);
              }
            }
          } catch (error) {}
        }
      );

      setArrayLs(linkedList.toNodeArray());
      toast.info(` Took ${steps} steps to delete a node`, {
        position: "top-center",
      });
      return node;
    } catch (error) {
      if (error instanceof IndexOutOfBoundsError) {
        toast.error(`No element found at index ${index}`, {
          position: "top-center",
        });
      }
    }
    return null;
  };
  const setIndexOutOfTheBound = (index: number) => {
    if (index >= linkedList.size || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${linkedList.size}`,
      });
      return true;
    }
    return false;
  };
  const get = async (index: number) => {
    let node: LinkedListNode<Primitive> | null = null;
    let steps = index + 1;
    if (!isDoublyLinkedList) {
      node = await findNode(index);
    } else {
      node = await linkedList.getNode(
        index,
        async (_node, _index, direction, _steps) => {
          steps = _steps || 1;
          if (_node && _node.ref) {
            try {
              await animate(
                _node.ref,
                index !== _index
                  ? `find-node ${ANIMATION_SPEED * 0.8 + "s"}`
                  : `get-node ${ANIMATION_SPEED + "s"}`
              );
              if (index !== _index) {
                if (direction === "forward")
                  await animateEdge(_node.nextEdge.ref);
                else if (direction === "backward")
                  await animateEdge(_node.prevEdge.ref);
              }
            } catch (error) {}
          }
        }
      );
    }
    if (node) {
      toast.info(`Node data: "${node.data}", took ${steps} steps`, {
        position: "top-center",
      });
    }
    return node;
  };
  const findNode = async (index: number, animateLast = true, isDel = false) => {
    if (setIndexOutOfTheBound(index)) return null;
    let j = 0;
    let node = linkedList.head;
    while (node) {
      if (node.ref)
        await animate(
          node.ref,
          !(index === j && animateLast)
            ? `find-node ${ANIMATION_SPEED * 0.8 + "s"}`
            : `${isDel ? "del" : "get"}-node ${ANIMATION_SPEED + "s"}`
        );

      if (index === j) {
        break;
      }

      if (node.ref && node.nextEdge) await animateEdge(node.nextEdge.ref);

      j++;
      node = node.next;
    }
    return node;
  };

  const traverse = async (direction: "forward" | "backward" = "forward") => {
    linkedList.traverse(direction, async (node, i) => {
      //handle animation
    });
  };
  const clear = () => {
    setIsStackOverFlow(false);
    linkedList.clean();
    setArrayLs([]);
    setError(null);
  };
  const setUpLinkedList = () => {
    linkedList.nodeWidth = isDoublyLinkedList ? 180 : 120;
    linkedList.nodeHeightSpacing = 40;
    linkedList.nodeWidthSpacing = 70;
    linkedList.nodeHeight = 80;
  };
  useEffect(() => {
    setUpLinkedList();
  }, []);
  return {
    linkedList,
    add,
    del,
    traverse,
    isStackOverFlow,
    clear,
    error,
    get,
    arrayLs,
  };
}
