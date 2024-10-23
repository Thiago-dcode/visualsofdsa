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
export default function UseLinkedList(isDoublyLinkedList = false) {
  const [linkedList, setLinkedList] = useState(new LinkedList());
  const { getAnimation } = UseLinkedListAnimation(linkedList);

  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const [arrayLs, setArrayLs] = useState(linkedList.toNodeArray());
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);

  const add = async (
    data: Primitive,
    index: number,
    position = new Position(0, 0),
    memoryAddress: string = ""
  ) => {
    try {
      if (!isDoublyLinkedList && index > 0) await findNode(index - 1, false);

      const node = await linkedList.add(data, index, position);
      node.memoryAddress = memoryAddress;
      node.isLastAdd = true;

      setArrayLs(linkedList.toNodeArray());
      toast.info(` Took ${index + 1} steps to add a new node`, {
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
      if (!isDoublyLinkedList) {
        node = await findNode(index,true,true);
        if (node) {
          toast.info(` Took ${index + 1} steps to delete`, {
            position: "top-center",
          });
        }
      }

      await linkedList.delete(index, async (node, next, prev) => {
        //handle animation on delete
      });
      setArrayLs(linkedList.toNodeArray());
      return node;
    } catch (error) {
      if (error instanceof IndexOutOfBoundsError) {
        toast.error(`No element found on  index ${index}`, {
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
    if (!isDoublyLinkedList) {
      node = await findNode(index);
      if (node) {
        toast.info(`Node data: "${node.data}", took ${index + 1} steps`, {
          position: "top-center",
          
        });
      }
    }
  };
  const findNode = async (index: number, animateLast = true,isDel=false) => {
    if (setIndexOutOfTheBound(index)) return null;
    let j = 0;
    let node = linkedList.head;
    while (node) {
      if (node.ref) await getAnimation(node.ref, index === j && animateLast,isDel);
      if (index === j) {
        break;
      }

      if (node.ref && node.nextEdge)
        await animate(node.nextEdge.ref, "lit-node-edge 0.5s");

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
    linkedList.nodeWidth = 120;
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
