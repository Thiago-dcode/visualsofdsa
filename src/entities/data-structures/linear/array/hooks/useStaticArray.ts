import Position from "@/lib/classes/Position";
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError";
import { Primitive } from "@/types";
import { useCallback, useRef, useState } from "react";
import Node from "../../_classes/Node";

export default function useStaticArray() {
  const [array, setArray] = useState<Node<Primitive>[] | null>(null);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const maxSize = useRef(30);
  const [data, setData] = useState<string>("");
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<{
    title: string;
  }|null>(null);
  const create = (size:number) => {
    if (size > maxSize.current) {
      throw new IndexOutOfBoundsError(
        `A Stack overflow error has ocurred. Array maximum size of ${maxSize.current} exceeded.`
      );
      }
    const _array = new Array(size);
    for (let i = 0; i < _array.length; i++) {
      _array[i] = new Node(null, new Position(0, 0));
    }
    setArray(_array);
  }

  const flush = () =>{
    setArray(null)
    setError(null)
  }
  return {
    create,
    flush,
    error,
    array
  }
}
