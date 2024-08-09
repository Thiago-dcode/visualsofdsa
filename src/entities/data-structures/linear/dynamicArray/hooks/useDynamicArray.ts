import { Primitive } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Node from "../../_classes/Node";
import useStaticArray from "../../staticArray/hooks/useStaticArray";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { searchResult, ArrayActions } from "../../staticArray/type";
import UseStaticArrayAnimation from "../../staticArray/hooks/UseStaticArrayAnimation";
import Position from "@/lib/classes/Position";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
import useDynamicArrayAnimation from "./useDynamicArrayAnimation";

export default function useDynamicArray() {
  const { writeAnimation } = UseStaticArrayAnimation();
  const { insertAnimation, popAnimation,deleteAnimation } = useDynamicArrayAnimation();
  const {
    array,
    setArray,
    write: _write,
    search: _search,
    error,
    setError,
  } = useStaticArray();
  const [capacity, setCapacity] = useState(10);
  const [action, setAction] = useState<ArrayActions>("create");
  const [size, setSize] = useState(0);
  const expand = useCallback(
    async (reset = false) => {
      const newCapacity = reset ? 10 : capacity * 2;
      const newArray: (Node<Primitive> | null)[] = new Array(newCapacity);
      if (array && newArray.length < array?.length && !reset) {
        throw new IndexOutOfBoundsError(
          "Dynamic array size exceed array capacity"
        );
      }
      for (let i = 0; i < newCapacity; i++) {
        if (array && array[i] instanceof Node && size > 0 && !reset) {
          const element = array[i];

          writeAnimation(element, () => {}, 1).catch(() => {});
          newArray[i] = element;
          continue;
        }
        newArray[i] = null;
      }
      setCapacity(newCapacity);
      setArray(newArray);
      if (reset) {
        setSize(0);
      }
    },
    [capacity, array, size]
  );
  const isOutOfTheOfTheBound = (index: number) => {
    if (index > size || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${size}`,
      });
      return true;
    }
    return false;
  };

  const write = async (data: Primitive, index: number) => {
    if (isOutOfTheOfTheBound(index)) return;
    if (index < size) setAction("write");
    else {
      setAction("push");
    }
    await _write(
      data,
      index,
      () => {
        if (index === size) {
          setSize((prev) => prev + 1);
        }
      },
      false,
      new DynamicArrayNode(data, new Position(0, 0))
    );
  };
  const push = async (data: Primitive) => {
    await write(data, size);
  };
  const fill = async (n:number) =>{

    for (let i = size; i < n; i++) {
      

      
    }

  }
  const pop = useCallback(async () => {
    if (size === 0 || !array) return;
    setAction("pop");
    const handlePop = async () => {
      if (array) {
        setSize((array) => array - 1);
        try {
          await popAnimation(array[size - 1]);
        } catch (error) {
          console.error("Pop animation rejected");
        }
        return array.map((d, i) => {
          if (i === size - 1) {
            return null;
          }
          return d;
        });
      }
      return null;
    };
    setArray(await handlePop());
  }, [array, size]);
  const insert = async (data: Primitive, index: number) => {
    if (index >= size || index < 0) {
      await write(data, index);
      return;
    }

    if (!array) {
      throw new Error("Array missing");
    }
    setAction("insert");

    let found = false;
    for (let i = capacity - 1; i >= 0; i--) {
      const node = array[i];
      if (node instanceof DynamicArrayNode && i < size && !found) {
        try {
          await insertAnimation(node, i, () => {});
        } catch (error) {
          console.log("Insert animation rejected");
        }
        array[i + 1] =
          node !== null
            ? new DynamicArrayNode(node?.data, new Position(0, 0), false)
            : null;
        if (i === index) {
          array[i] = new DynamicArrayNode(data, new Position(0, 0), true);
          setSize(size + 1);
          found = true;
        }
        continue;
      }
      array[i] = node
        ? new DynamicArrayNode(node?.data, new Position(0, 0), false)
        : null;
    }
  };
  const del = async (index: number) => {

    if (size === 0 || !array) return;
    if (index > size - 1 || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${size}`,
      });
      return;
    }
    if (index == size - 1) {
      await pop();
      return;
    }
    setAction("delete");
  
    for (let i = 0; i < capacity; i++) {
      const node = array[i];
      if (i === index) {
        try {
          await popAnimation(node, ()=>{},0.8);
        } catch (error) {}
        array[i] = null;

       
        continue;
      }
      if(node instanceof DynamicArrayNode && i<size){
        if(i >index){
          try {
            await deleteAnimation(node,i,()=>{
              array[i - 1] = new DynamicArrayNode(node.data, node.position, false);
              const nextNode = array[i + 1];
               array[i] = nextNode?new DynamicArrayNode(nextNode.data, nextNode.position, false):null;
           })
           } catch (error) {
              console.error('DELETE ANIMATION REJECTED')
           }
        }else{

          array[i] = new DynamicArrayNode(node.data, node.position, false) 
          
        }
      }else{
        array[i] = null;
      }
     
     
    }
    setSize(size - 1);
  };
  const search = async (
    data: Primitive,
    callback = (result: searchResult) => {}
  ) => {
    setAction("search");
    await _search(data, callback);
  };
  const cleanUp = useCallback(() => {
    setError(null);
    expand(true);
  }, []);

  useEffect(() => {
    expand(true);
  }, []);

  useEffect(() => {
    if (size === capacity) {
      expand();
    }
  }, [size]);
  return {
    array,
    capacity,
    size,
    write,
    push,
    insert,
    error,
    cleanUp,
    expand,
    action,
    search,
    pop,
    delete: del,
  };
}
