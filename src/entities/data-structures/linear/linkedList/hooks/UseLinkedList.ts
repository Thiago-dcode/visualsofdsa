import React, { useEffect, useState } from "react";
import LinkedList from "../classes/LinkedList";
import { Primitive } from "@/types";
import Position from "@/lib/classes/Position";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { toast } from 'sonner';

export default function UseLinkedList() {
  const [linkedList, setLinkedList] = useState(new LinkedList());
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
    memoryAddress: string
  ) => {

    try {
      const node = await linkedList.add(data, index, position);
      node.memoryAddress = memoryAddress;
      setArrayLs(linkedList.toNodeArray());
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
      const node = linkedList.findNode(index);
      if (!node) throw IndexOutOfBoundsError
      await linkedList.delete(index, async (node, next, prev) => {
        //handle animation on delete
      });
      setArrayLs(linkedList.toNodeArray())
      return node;
    } catch (error) {
     
      if (error instanceof IndexOutOfBoundsError) {
        toast.error(`No element found on the index ${index}`,{
          position:'top-center'
        })
      }

    }
    return null;

  };
  const get = async (index: number) => {
    const node = linkedList.getNode(index);
    //handle get animation
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
    setError(null)
  }
  const setUpLinkedList = () => {

    linkedList.nodeWidth = 120;
    linkedList.nodeHeightSpacing = 40;
    linkedList.nodeWidthSpacing = 70;
    linkedList.nodeHeight = 80;

  }
  useEffect(() => {
    setUpLinkedList()

  }, []);
  return {
    linkedList,
    add,
    del,
    traverse,
    isStackOverFlow,
    clear,
    error,
    arrayLs
  };
}
