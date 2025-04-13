import Position from "../../../../../lib/classes/position/Position";
import { Direction, Primitive, MemorySize } from "@/types";
import { useCallback, useState } from "react";
import Node from "../../_classes/Node";
import UseStaticArrayAnimation from "./UseStaticArrayAnimation";
import { delay, random } from "@/lib/utils";
import { searchResult } from "../type";
import { useSpeed } from "@/hooks/useSpeed";
import { config } from "@/config";


export default function useStaticArray(size: number =50) { 
  const {speed, handleSetSpeed} = useSpeed(2,config.localStorageKeys.speed.staticArray);
  const [array, setArray] = useState<(Node<Primitive> | null)[] | null>(null);
 
  const { writeAnimation, accessAnimation, searchAnimation } =
    UseStaticArrayAnimation(speed);
  const [memorySize,setMemorySize] = useState(MemorySize.L);
  const [maxSize, setMaxSize] = useState(size);
  const [_render, setRender] = useState(false)

  
  const [error, setError] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const render = useCallback(() => {
    setRender(prev => !prev)
  }, [])
  const initArray = (size: number) => {
    if (size < 0 || size > maxSize) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `A Stack overflow error has ocurred. Array maximum size of ${maxSize} exceeded.`,
      });
      return null;
    }
    return new Array<Node<Primitive> | null>(size);
  };
  const create = async (size: number, fillArrayWithNode = true) => {
    const _array = initArray(size);
    if (!_array) return;

    for (let i = 0; i < _array.length; i++) {
      _array[i] = fillArrayWithNode ? new Node(null, new Position(0, 0)) : null;
    }
    await delay(100);
    setArray(_array);
  };
  const createUnsorted = async (size: number) => {
    const _array = initArray(size);
    if (!_array) return;
    const getAUniqueRandomNumber = (memo: { [key: number]: true } = {}) => {
      const n = random(0, 60000);
      if (memo[n]) {
        return getAUniqueRandomNumber(memo);
      }
      memo[n] = true;
      return n;
    };

    for (let i = 0; i < size; i++) {
      _array[i] = new Node(getAUniqueRandomNumber(), new Position(0, 0));
    }
    await delay(100);
    setArray(_array);
    return _array;
  };

  const createSorted = async (size:number,direction:Direction = 'ascending') =>{
    const _array = initArray(size);
    if (!_array) return;

      let data = random(0,5000);
      for (let i = 0; i < _array.length; i++) {
        let nRandom = random(1,5000);
        if(direction ==='ascending')  data += nRandom
        else data -= nRandom;
      
        _array[i] = new Node(data, new Position(0, 0));
        
      }

    setArray(_array);

    return _array;


  }
  const write = async (
    data: Primitive,
    index: number,
    isFilling = false,
    callback = () => {},
    customNode: Node<Primitive> = new Node(data, new Position(0, 0))
  ) => {
    if (!array) return;
    if (throwIndexOutOfTheBound(index)) {
      return;
    }
    let node = array[index];
    if (node === null) {
      array[index] = customNode;
      node = array[index];
    }
    node.data = data;
      await writeAnimation(node, isFilling );
      render();
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
  const search = useCallback(async (
    data: Primitive,
     ) => {
    if (!array) return {
      steps: 0,
      found: false,
      data: null,
    };
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
 
    return {
      steps,
      found,
      data,
    };
  },[array,size]);

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
    createUnsorted,
    createSorted,
    memorySize,
    setMemorySize,
    handleSetSpeed,
    speed
  };
}
