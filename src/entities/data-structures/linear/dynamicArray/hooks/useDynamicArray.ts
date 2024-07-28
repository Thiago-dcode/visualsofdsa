import Position from "../../../../../lib/classes/Position";
import { Primitive } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

import Node from "../../_classes/Node";
// import "../style.css";

import useStaticArray from "../../staticArray/hooks/useStaticArray";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";

export default function useDynamicArray() {
  const { array, setArray, write: _write, error, setError,flush } = useStaticArray();
  const [capacity, setCapacity] = useState(10);
  const [size, setSize] = useState(0);
  const expand = useCallback(() => {
    const newCapacity = size === 0 ? capacity : capacity * 2;

    const newArray: (Node<Primitive> | null)[] = new Array(newCapacity);
    if (array && newArray.length < array?.length) {
      throw new IndexOutOfBoundsError(
        "Dynamic array size exceed array capacity"
      );
    }
    for (let i = 0; i < newCapacity; i++) {
      if (array && array[i] instanceof Node) {
        const element = array[i];
        newArray[i] = element;
        continue;
      }
      newArray[i] = null;
    }

    setCapacity(newCapacity);
    setArray(() => newArray);
  }, [capacity, array, size]);

  const write = async (data: Primitive, index: number) => {
    if (index > size || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${size}`,
      });
      return;
    }

    await _write(data, index, () => {
      if (index === size) {
        setSize((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    expand();
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
    error,
  };
}
