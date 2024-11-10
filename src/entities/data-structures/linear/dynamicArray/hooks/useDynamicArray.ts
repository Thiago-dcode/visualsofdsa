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
const maxSize = 500;
export default function useDynamicArray() {
  const { writeAnimation } = UseStaticArrayAnimation();
  const { insertAnimation, popAnimation, deleteAnimation } =
    useDynamicArrayAnimation();
  const {
    array,
    setArray,
    search: _search,
    error,
    access:_access,
    setError,
  } = useStaticArray();
  const [capacity, setCapacity] = useState(10);
  const [action, setAction] = useState<ArrayActions>("create");
  const [size, setSize] = useState(0);
  const [fillAmount, setFillAmount] = useState(0);
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

  const handleFillAmount = useCallback(async () => {
    if (fillAmount === 0) return;
    push("data-" + size);
    // await delay(200);
    setFillAmount((prev) => prev - 1);
  }, [fillAmount]);
  const write = async (data: Primitive, index: number) => {
    if (isOutOfTheOfTheBound(index) || !array) return;
    if (index === size) {
      push(data);
      return;
    }
    setAction("write");
    const node = array[index];
    if (!node) {
      array[index] = new DynamicArrayNode(data, new Position(0, 0));
    } else {
      node.data = data;
    }
    try {
      await writeAnimation(array[index], () => {}, 0.5);
    } catch (error) {}
  };

  const access = async (index:number)=>{
    if (isOutOfTheOfTheBound(index) || !array) return;
    setAction('write');
    await _access(index);
  }
  const push = (data: Primitive) => {
    if (!array) return;
    setAction("push");
    setSize((prev) => prev + 1);
    array[size] = new DynamicArrayNode(data, new Position(0, 0));
  };
  const fill = async (n: number) => {
    setFillAmount(n);
  };
  const pop = useCallback(async () => {
    if (size === 0 || !array) return;
    setAction("pop");
    await popAnimation(array[size - 1]).catch(() => {});
    setSize((prev) => prev - 1);
    array[size - 1] = null;
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
          await popAnimation(node, () => {}, 0.8);
        } catch (error) {}
        array[i] = null;

        continue;
      }
      if (node instanceof DynamicArrayNode && i < size) {
        if (i > index) {
          try {
            await deleteAnimation(node, i, () => {
              array[i - 1] = new DynamicArrayNode(
                node.data,
                node.position,
                false
              );
              const nextNode = array[i + 1];
              array[i] = nextNode
                ? new DynamicArrayNode(nextNode.data, nextNode.position, false)
                : null;
            });
          } catch (error) {
          
          }
        } else {
          array[i] = new DynamicArrayNode(node.data, node.position, false);
        }
      } else {
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
  const cleanUp = () => {
    setError(null);
    expand(true);
    setFillAmount(0);
  };

  useEffect(() => {
    expand(true);
  }, []);

  useEffect(() => {
    if (size >= maxSize) {
      setError({
        name: "MaxSizeException",
        description: `The array cannot acceed ${maxSize} length`,
      });
      return;
    }
    if (fillAmount > 0) handleFillAmount();

    if (size === capacity) {
      expand();
    }
  }, [size, fillAmount]);

  return {
    array,
    capacity,
    size,
    write,
    access,
    push,
    insert,
    error,
    cleanUp,
    expand,
    action,
    search,
    pop,
    fill,
    maxSize,
    delete: del,
  };
}
