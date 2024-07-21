import Position from "../../../../../lib/classes/Position";
import { Primitive } from "@/types";
import { useCallback, useRef, useState } from "react";
import Node from "../../_classes/Node";
import "../style.css";
import UseStaticArrayAnimation from "./UseStaticArrayAnimation";
import { delay } from "@/lib/utils";

export default function useStaticArray() {
  const [array, setArray] = useState<Node<Primitive>[] | null>(null);
  const { writeAnimation, accessAnimation,searchAnimation } = UseStaticArrayAnimation();
  const maxSize = useRef(100);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const create = async (size: number) => {
    if (size < 0 || size > maxSize.current) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `A Stack overflow error has ocurred. Array maximum size of ${maxSize.current} exceeded.`,
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
  const write = async (data: Primitive, index: number, callback = () => {}) => {
    if (!array) return;
    throwIndexOutOfTheBound(index);
    const node = array[index];
    if(!node) return;
    node.data = data;

    await writeAnimation(node);
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
  const search = async (data:Primitive, callback = () => {}) => {
    if (!array) return;
     for (let i = 0; i < array.length; i++) {
      const node = array[i];
      if(data === node.data){
        await accessAnimation(node)
        break;
      }
      await searchAnimation(node);
     }
    callback();
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
    maxSize: maxSize.current,
  };
}
