import Position from "../../../../../lib/classes/Position";
import { Primitive } from "@/types";
import { useRef, useState } from "react";
import Node from "../../_classes/Node";
import "../style.css";
import UseStaticArrayAnimation from "./UseStaticArrayAnimation";

export default function useStaticArray() {
  const [array, setArray] = useState<Node<Primitive>[] | null>(null);
  const { writeAnimation } = UseStaticArrayAnimation();
  const maxSize = useRef(50);
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);
  
  
  const create = (size: number) => {
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
    setArray(_array);
  };
  const write = async (data: Primitive, index: number, callback = () => {}) => {
    if (!array) return;
    if (index < 0 || index >= array.length) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${array.length}`,
      });
      return;
    }
    const node = array[index];
    node.data = data;
   
    await writeAnimation(node);
    callback();
  };
  const flush = () => {
    setArray(null);
    setError(null);
  };
  return {
    create,
    flush,
    error,
    array,
    
    maxSize: maxSize.current,
    write,
  };
}
