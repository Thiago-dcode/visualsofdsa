import React, { useEffect, useState } from "react";
import LinkedList from "../classes/LinkedList";
import { Primitive } from "@/types";
import Position from "@/lib/classes/Position";
import LinkedListNode from "../classes/LinkedListNode";
import { chownSync } from "fs";

export default function UseLinkedList() {
  const [linkedList, setLinkedList] = useState(new LinkedList());
  const [arrayLs, setArrayLs] = useState(linkedList.toNodeArray());
  const add = async (
    data: Primitive,
    index: number,
    position = new Position(0, 0)
  ) => {
    await linkedList.add(data, index, position, async (node, next, prev) => {
      //handle animation on add
    });
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
    linkedList.nodeWidth = 70;
    linkedList.nodeHeightSpacing = 20;
    linkedList.nodeWidthSpacing = 40;
    linkedList.nodeHeight = 50;
    console.log(linkedList.nodeHeight)
    
  }, []);
  return {
    arrayLs,
    linkedList,
    add,
    del,
    traverse,
  };
}
