import Position from "../../../../../lib/classes/Position";
import { Primitive } from "@/types";
import { useCallback, useRef, useState } from "react";
import Node from "../../_classes/Node";
import "../style.css";
import UseStaticArrayAnimation from "./UseStaticArrayAnimation";
import { delay } from "@/lib/utils";
import { searchResult } from "../type";

export default function useStaticArray() {
  const [array, setArray] = useState<(Node<Primitive> | null)[] | null>(null);
  const { writeAnimation, accessAnimation, searchAnimation } =
    UseStaticArrayAnimation();
  const [maxSize, setMaxSize] = useState(50);
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const create = async (size: number, fillArrayWithNode = true) => {
    if (size < 0 || size > maxSize) {
      setError({                       
        name: "IndexOutOfTheBoundException",
        description: `A Stack overflow error has ocurred. Array maximum size of ${maxSize} exceeded.`,
      });
      return;
    }
    const _array = new Array(size);

    for (let i = 0; i < _array.length; i++) {
      _array[i] = fillArrayWithNode ? new Node(null, new Position(0, 0)) : null;
    }
    await delay(100);
    setArray(_array);
  };

  const write = async (
    data: Primitive,
    index: number,
    callback = () => {},
    isFilling = false,
    customNode:Node<Primitive> = new Node(data, new Position(0, 0))
  ) => {
    if (!array) return;
    if (throwIndexOutOfTheBound(index)) {
      console.log('ERROR: ',index, array.length)
      return};
    let node = array[index];
    if (node === null) {
      array[index] = customNode;
      node = array[index];
    }
    node.data = data;

    try {
      await writeAnimation(node, () => {}, isFilling ? 0.2 : 0.6);
    } catch (error) {
      //handle rejected animation

    }
    callback();
  };

  const throwIndexOutOfTheBound = useCallback(
    (index: number): boolean => {
      if (!array) return false;
      if (index < 0 || index >= array.length) {
        setError({
          name: "IndexOutOfTheBoundException",
          description: `Index ${index} out of bounds for length ${array.length}`,
        });
        return true;
      }
      return false;
    },
    [array]
  );

  const access = async (index: number, callback = () => {}) => {
    if (!array) return;
    if (throwIndexOutOfTheBound(index)) return;
    await accessAnimation(array[index], () => {});
    callback();
  };
  const search = async (
    data: Primitive,
    callback = (result: searchResult) => {}
  ) => {
    if (!array) return;
    let steps = 0;
    let found = false;
    for (let i = 0; i < array.length; i++) {
      steps++;
      const node = array[i];
      if (node && data === node.data) {
        await accessAnimation(node);
        found = true;
        break;
      }
      try {
        await searchAnimation(node);
      } catch (error) {}
    }
    callback({
      steps,
      found,
      data,
    });
  };

  const flush = () => {
    setArray(null);
    setError(null);
  };
  return {
    flush,
    error,
    array,
    create,
    write,
    access,
    search,
    maxSize,
    setMaxSize,
    setArray,
    setError,
  };
}
