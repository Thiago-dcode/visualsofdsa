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
  const { insertAnimation } = useDynamicArrayAnimation();
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
  const [render, setRender] = useState(false);
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
  const insert = async (data: Primitive, index: number) => {
    if (index >= size || index < 0) {
      await write(data, index);
      return;
    }
    //handle insert
    if (!array) {
      throw new Error("Array missing");
    }
    setAction("insert");

    for (let i = size - 1; i >= 0; i--) {
      const element = array[i];
      if (element instanceof DynamicArrayNode) {
        element.isLastInserted = false;
        try {
          if(element.ref){

          }else{

          }
          await insertAnimation(element,i, () => {});
        } catch (error) {
          console.log('THIS SHOULD NEVER BE PRINTED')
        }

      }else{
        console.error('Node is not instance of dynamic array node', element)
      }
      array[i + 1] = element;
      if (i === index) {
        array[i] = new DynamicArrayNode(data, new Position(0, 0), true);
        setSize(size + 1);
        break;
      }
    }
    // for (let i = 0; i < array.length; i++) {
    //   const element = array[i];

    //   console.log(element);
    // }
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
  };
}
