import { Primitive } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import Node from "../../_classes/Node";
import useStaticArray from "../../staticArray/hooks/useStaticArray";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { searchResult, staticArrayAction } from "../../staticArray/type";
import UseStaticArrayAnimation from "../../staticArray/hooks/UseStaticArrayAnimation";

export default function useDynamicArray() {
  const { writeAnimation } = UseStaticArrayAnimation();
  const {
    array,
    setArray,
    write: _write,
    search: _search,
    error,
    setError,
  } = useStaticArray();
  const [capacity, setCapacity] = useState(10);
  const [action, setAction] = useState<staticArrayAction>("create");
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

  const write = async (data: Primitive, index: number) => {
    if (index > size || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${size}`,
      });
      return;
    }
    if (index < size) setAction("write");
    else {
      setAction("push");
    }
    await _write(data, index, () => {
      if (index === size) {
        setSize((prev) => prev + 1);
      }
    });
  };
  const push = async (data: Primitive) => {
    await write(data, size);
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
    error,
    cleanUp,
    expand,
    action,
    search,
  };
}
