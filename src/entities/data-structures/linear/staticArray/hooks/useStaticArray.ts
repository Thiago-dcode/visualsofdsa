import Position from "../../../../../lib/classes/Position";
import { Primitive } from "@/types";
import { useCallback, useRef, useState } from "react";
import Node from "../../_classes/Node";
import "../style.css";
import UseStaticArrayAnimation from "./UseStaticArrayAnimation";
import { delay } from "@/lib/utils";
import { searchResult } from "../type";

export default function useStaticArray() {
  const [array, setArray] = useState<Node<Primitive>[] | null>(null);

  const { writeAnimation, accessAnimation, searchAnimation } =
    UseStaticArrayAnimation();
  const [maxSize, setMaxSize] = useState(50);
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const create = async (size: number) => {
    if (size < 0 || size > maxSize) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `A Stack overflow error has ocurred. Array maximum size of ${maxSize} exceeded.`,
      });
      return;
    }
    const _array = new Array(size);
    for (let i = 0; i < _array.length; i++) {
      _array[i] = new Node(null, new Position(0, 0));
    }
    await delay(100);
    setArray(_array);
  };
  const write = async (
    data: Primitive,
    index: number,
    callback = () => {},
    isFilling = false
  ) => {
    if (!array) return;
    throwIndexOutOfTheBound(index);
    const node = array[index];
    if (!node) return;
    node.data = data;

    await writeAnimation(node, () => {}, isFilling ? 0.2 : 1);
    callback();
  };

  const throwIndexOutOfTheBound = useCallback(
    (index: number) => {
      if (!array) return;
      if (index < 0 || index >= array.length) {
        setError({
          name: "IndexOutOfTheBoundException",
          description: `Index ${index} out of bounds for length ${array.length}`,
        });
        return;
      }
    },
    [array]
  );

  const access = async (index: number, callback = () => {}) => {
    if (!array) return;
    throwIndexOutOfTheBound(index);
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
      if (data === node.data) {
        await accessAnimation(node);
        found = true;
        break;
      }
      await searchAnimation(node);
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
  };
}
