import React, { useEffect, useState } from "react";
import LinkedList from "../classes/LinkedList";
import { Primitive } from "@/types";
import Position from "@/lib/classes/Position";


export default function UseLinkedList() {
  const [linkedList, setLinkedList] = useState(new LinkedList());
  
  const [arrayLs, setArrayLs] = useState(linkedList.toNodeArray());
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);
  const add = async (
    data: Primitive,
    index: number,
    position = new Position(0, 0),
    memoryAddress: string
  ) => {
    if(index < 0 || index> linkedList.size) {
      setIsStackOverFlow(true);
    }
     const node = await linkedList.add(data, index, position);
     node.memoryAddress =memoryAddress;
    setArrayLs(linkedList.toNodeArray());
  };

  const del = async (index: number) => {
    await linkedList.delete(index, async (node, next, prev) => {
      //handle animation on delete
    });
    setArrayLs(linkedList.toNodeArray());
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
  useEffect(() => {
    linkedList.nodeWidth = 120;
    linkedList.nodeHeightSpacing = 40;
    linkedList.nodeWidthSpacing = 70;
    linkedList.nodeHeight = 80;
    console.log(linkedList.nodeHeight)
    
  }, []);
  return {
    arrayLs,
    linkedList,
    add,
    del,
    traverse,
    isStackOverFlow
  };
}
