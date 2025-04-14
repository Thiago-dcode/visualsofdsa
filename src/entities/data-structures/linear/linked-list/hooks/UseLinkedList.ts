import React, { useCallback, useEffect, useState } from "react";
import LinkedList from "../classes/LinkedList";
import { Primitive } from "@/types";
import Position from "@/lib/classes/position/Position";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { toast } from "sonner";
import "../animation.css";
import LinkedListNode from "../classes/LinkedListNode";
import { animate } from "@/lib/animations";
import { useDarkMode } from "@/context/darkModeContext";
import { useSpeed } from "@/hooks/useSpeed";
import { config } from "@/config";

export default function UseLinkedList(isDoublyLinkedList = false) {
  const [linkedList] = useState(new LinkedList());
 const {isDark} = useDarkMode();

 const {speed,handleSetSpeed}= useSpeed(2,config.localStorageKeys.speed.linkedList)
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);


const getSpeed = useCallback(()=>{
  switch (speed) {
    case 1:
      return 0.8;
    case 2:
      return 0.5;
    case 3:
      return 0.3;
    case 4:
      return 0.15;
    default:
      return 0.5;
  }

},[speed])

  const [arrayLs, setArrayLs] = useState(linkedList.toNodeArray());
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);

  const animateEdge = (ref: HTMLElement | null) =>
    animate(ref, `lit-node-edge`, 0.5);
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
                `find-node-${isDark?'dark':'light'}`,
               getSpeed()
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
        setIndexOutOfTheBound(index);
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
              const found = index === _index;
              await animate(
                _node.ref,
                `${found ? "del-node" : `find-node-${isDark?'dark':'light'}`}`,
                found?getSpeed() * 0.8:getSpeed()
              );
              if (!found) {
                if (direction === "forward")
                  await animateEdge(_node.nextEdge.ref);
                else if (direction === "backward")
                  await animateEdge(_node.prevEdge.ref);
              }
            }
          } catch (error) {
           
          }
        }
      );

      setArrayLs(linkedList.toNodeArray());
      toast.info(` Took ${steps} steps to delete a node`, {
        position: "top-center",
      });
      return node;
    } catch (error) {
      if (error instanceof IndexOutOfBoundsError) {
        setIndexOutOfTheBound(index);
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
    try {
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
                const found = index === _index;
                await animate(
                  _node.ref,
                  found
                    ? `get-node`
                    : `find-node-${isDark?'dark':'light'}`,
                    found?getSpeed() * 0.8:getSpeed()
                );
                if (!found) {
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
    } catch (error) {
      if (error instanceof IndexOutOfBoundsError) {
        setIndexOutOfTheBound(index);
      }
    }
    return null;
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
            ? `find-node-${isDark?'dark':'light'}`
            : `${isDel ? "del" : "get"}-node`,
            !(index === j && animateLast)?getSpeed():getSpeed() * 1.2
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
    speed,
    handleSetSpeed,
  };
}
