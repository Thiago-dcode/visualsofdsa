import { Primitive } from "@/types";
import { useCallback, useEffect,  useState } from "react";
import Node from "../../_classes/Node";
import useStaticArray from "../../static-array/hooks/useStaticArray";
import UseStaticArrayAnimation from "../../static-array/hooks/UseStaticArrayAnimation";
import Position from "@/lib/classes/position/Position";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
import useDynamicArrayAnimation from "./useDynamicArrayAnimation";
import { useToast } from "@/hooks/useToast";
import { config } from "@/config";
import { useSpeed } from "@/hooks/useSpeed";
const maxSize = 500;
export default function useDynamicArray() {
  const {
    array,
    setArray,
    search: _search,
    error,
    access: _access,
    setError,
    memorySize,
    setMemorySize,
  } = useStaticArray();

  const { speed, handleSetSpeed } = useSpeed(2,config.localStorageKeys.speed.dynamicArray);
  const { writeAnimation } = UseStaticArrayAnimation(speed);
  const { popAnimation, shiftAnimation } = useDynamicArrayAnimation(speed);
  const { toastInfo,toastSuccess,toastError } = useToast();
  const [capacity, setCapacity] = useState(10);
  const [size, setSize] = useState(0);
  const expand = useCallback(
    async (reset = false) => {
      const newCapacity = reset ? 10 : (size > capacity ? size : capacity) * 2;
      const newArray: (Node<Primitive> | null)[] = [];
      for (let i = 0; i < newCapacity; i++) {
        if (array && array[i] instanceof Node && size > 0 && !reset) {
          newArray[i] = array[i];
          continue;
        }
        newArray[i] = null;
      }
      if (!reset) toastSuccess(`Array capacity increased to: ${newCapacity}`);

      setCapacity(newCapacity);
      setArray(newArray);

      if (reset) {
        setSize(0);
      }
    },
    [capacity, array, size]
  );
  const isOutOfTheOfTheBound = useCallback((index: number,_size = size) => {
    if (index > _size || index < 0) {
      setError({
        name: "IndexOutOfTheBoundException",
        description: `Index ${index} out of bounds for length ${_size}`,
      });
      return true;
    }
    return false;
  },[size])
const maxSizeException = (newSize:number) => {
  if (newSize >maxSize) {
    setError({
      name: "MaxSizeException",
      description: `The array cannot exceed ${maxSize} length`,
    });
    return true;
  }
  return false;
}

  const write = useCallback(async (data: Primitive, index: number) => {
    if (isOutOfTheOfTheBound(index) || !array) return;
    if (index === size) {
      push(data);
      return;
    }
    const node = array[index];
    if (!node) {
      array[index] = new DynamicArrayNode(data, new Position(0, 0));
    } else {
      node.data = data;
    }
    try {
      await writeAnimation(array[index]);
      toastInfo(`Wrote ${data} at index: ${index}. Took one step`);
    } catch (error) {}
  },[array,size]);

  const access = useCallback(async (index: number) => {
    if (isOutOfTheOfTheBound(index) || !array) return;
    await _access(index);
  },[array,size]);
  const push =useCallback((data: Primitive) => {
    if (!array || maxSizeException(size + 1)) return false;
    setSize((prev) => prev + 1);
    array[size] = new DynamicArrayNode(data, new Position(0, 0));
    array[size].isLastAdd = true;
    toastInfo(`Pushed ${data}. Took one step`);
    return true;
  },[array,size]);
  const fill = useCallback(
    async (n: number) => {
      if (!array || maxSizeException(size + n)) return false;
      const newSize = size + n;
      for (let i = 0; i < newSize; i++) {
        const arrayNode = array[i];
        if (!arrayNode) {
          const node = new DynamicArrayNode("data-" + i, new Position(0, 0));
          node.isLastAdd = true;
          array[i] = node;
        } else {
          arrayNode.isLastAdd = false;
        }
      }
      toastInfo(`Filled ${n} elements. Took ${n} steps`);
      setSize(newSize);
      return true;
    },
    [array, size]
  );
  const pop = useCallback(async () => {
    if (size === 0 || !array) return;
    await popAnimation(array[size - 1]).catch(() => {});
    toastInfo(`Popped array element: ${array[size - 1]?.data}. Took one step`);
    setSize((prev) => prev - 1);
    array[size - 1] = null;
  }, [array, size]);

  
  const insert = useCallback(async (data: Primitive, index: number) => {
    if (!array || isOutOfTheOfTheBound(index) || maxSizeException(size + 1)) return false;
    if (index >= size || index < 0) {
      await write(data, index);
      return true;
    }
    let found = false;
    for (let i = capacity - 1; i >= 0; i--) {
      const node = array[i];
      if (node instanceof DynamicArrayNode && i < size && !found) {
        try {
          await shiftAnimation(node, i, "right");
        } catch (error) {}
        array[i + 1] =
          node !== null
            ? new DynamicArrayNode(node?.data, node.position, false)
            : null;
        if (i === index) {
          const newNode = new DynamicArrayNode(data, node.position, true);
          newNode.isLastAdd = true;
          array[i] = newNode;
          found = true;
        }
        continue;
      }
      array[i] = node
        ? new DynamicArrayNode(node?.data, node.position, false)
        : null;
    }
    toastInfo(`Inserted ${data} at index: ${index}. Took ${size - index} steps`);
    setSize((prev) => prev + 1);
    return true;
  },[array,size])


  const del = useCallback(async (index: number) => {
    if (size === 0 || !array) return;
    if (isOutOfTheOfTheBound(index,size-1)) return;
    if (index == size - 1) {
      await pop();
      return;
    }
    try {
      await popAnimation(array[index]);
    } catch (error) {}

    for (let i = index + 1; i < size; i++) {
      const node = array[i];
      if (node instanceof DynamicArrayNode) {
        try {
          await shiftAnimation(node, i, "left");
          array[i - 1] = new DynamicArrayNode(node.data, node.position, false);
        } catch (error) {}
      }
    }
    toastInfo(`Deleted array element ${array[index]?.data} at index: ${index}. Took ${size - index} steps`);
    array[size - 1] = null;
    setSize((prev) => prev - 1);
  },[array,size])
  const search =useCallback( async (
    data: Primitive,
  ) => {
    if(size === 0) {
      toastError(`Array is empty`);
      return;
    }
   const {steps,found} = await _search(data);
    toastInfo(`${found ? "Found" : "Not found"} ${data}, took ${steps} steps`);
  },[size])
  const cleanUp = () => {
    setError(null);
    expand(true);
  };

  useEffect(() => {
    if (maxSizeException(size))return
    if (size >= capacity) {
      expand();
    }
  }, [size, capacity]);

  useEffect(() => {
    expand(true);
  }, []);

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
    search,
    pop,
    fill,
    maxSize,
    delete: del,
    memorySize,
    setMemorySize,
    speed,
    handleSetSpeed
  };
}
