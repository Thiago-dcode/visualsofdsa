import Node from "@/entities/data-structures/linear/_classes/Node";
import {
  Direction,
  Entities,
  EntityWithType,
  Position,
  Primitive,
  speed,
} from "@/types";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { v4 as uuid4 } from "uuid";
import PositionClass from "./classes/position/Position";
import { Link } from "@/components/app/nav/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const buildLinkFromArgs = (...args: string[]): Link => {
  return args.reduce((prev, curr) => prev + `/${curr}`, "") as Link;
};
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const getSpeed = (speed: speed) => {
  switch (speed) {
    case 1:
      return 1;
    case 2:
      return 0.5;
    case 3:
      return 0.2;

    default:
      return 0.5;
  }
};
export const getMinMaxFromArrayOfNodes = (
  array: Node<number>[],
  direction: Direction,
  sorted: boolean
) => {
  return {
    min: sorted
      ? array[direction === "ascending" ? 0 : array.length - 1].data
      : getMinInAnArrayOfNodes(array),
    max: sorted
      ? array[direction === "ascending" ? array.length - 1 : 0].data
      : getMaxInAnArrayOfNodes(array),
  };
};
export const createArrayOfNodes = (array: Primitive[]) => {
  const arrayNodes: Node<Primitive>[] = [];
  for (let i = 0; i < array.length; i++) {
    arrayNodes.push(new Node(array[i], new PositionClass(0, 0), null));
  }
  return arrayNodes;
};
export const createRandomUniqueArrayOfNumbers = (
  size: number,
  range = [-5000, 5000]
) => {
  if (size > Math.abs(range[0]) + Math.abs(range[1])) {
    throw new Error("The size must be LESS or EQUAL to  sum of range");
  }
  const memo: {
    [key: number]: true;
  } = {};
  const getUnique = () => {
    const num = random(range[0], range[1]);
    if (memo[num]) return getUnique();
    else {
      memo[num] = true;

      return num;
    }
  };
  const array: number[] = [];
  for (let i = 0; i < size; i++) {
    array.push(getUnique());
  }
  return array;
};
export const createRandomUniqueArrayOfNodes = (
  size: number,
  range = [-5000, 5000]
) => createRandomUniqueArrayOfNumbers(size,range).map(num=>new Node(num,new PositionClass(0,0),null));
export const createRandomArrayOfNodes = (size: number, range = [-500, 500]) => {
  const arrayNodes: Node<number>[] = [];
  for (let i = 0; i < size; i++) {
    arrayNodes.push(
      new Node(random(range[0], range[1]), new PositionClass(0, 0), null)
    );
  }
  return arrayNodes;
};
export const random = (min: number = 0, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));
export const prefix0 = (n: number): string => {
  if (n < 10) {
    return "0" + n;
  }
  return n + "";
};
export function calculateRuleOfThree(a: number, b: number, x: number): number {
  if (a === 0) {
    throw new Error(
      "The first value 'a' cannot be zero to avoid division by zero."
    );
  }
  return (b * x) / a;
}

export const getMemoryAddress = (index: number) => {
  return "0x" + prefix0(index);
};
export const generateKey = (pre: Primitive = "") => {
  return `${pre}_${uuid4()}`;
};
export function removePx(value: string): number {
  if (!value) return 0;
  const result = parseFloat(value.replace(/px$/, ""));
  return isNaN(result) ? 0 : result;
}
export function getEuclideanDistance(position1: Position, position2: Position) {
  return Math.sqrt(
    Math.pow(position1.x - position2.x, 2) +
      Math.pow(position1.y - position2.y, 2)
  );
}
export const copyToClipboard = async (
  text: string,
  showToast = true
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    if (!(global?.window && window.navigator)) {
      throw new Error("Windows is not defined");
    }
    // const result = await navigator.permissions.query({
    //   name: "clipboard-write" as PermissionName,
    // });
    // if (result.state === "denied") {
    //   throw new Error("Permission denied");
    // }
    await navigator.clipboard.writeText(text);
    if (showToast)
      toast.info("Value copied " + text, {
        position: "top-left",
        duration: 1000,
      });
    return {
      success: true,
    };
  } catch (err) {
    let message =
      err instanceof Error
        ? "Failed to copy: " + err.message
        : "Failed to copy";
    console.error(message);
    return {
      success: false,
      error: message,
    };
  }
};
export const getMinInAnArrayOfNodes = (array: Node<number>[]) => {
  let min = array[0].data;
  for (let i = 1; i < array.length; i++) {
    const num = array[i].data;
    if (num < min) min = num;
  }
  return min;
};
export const getMaxInAnArrayOfNodes = (array: Node<number>[]) => {
  let max = array[0].data;
  for (let i = 1; i < array.length; i++) {
    const num = array[i].data;
    if (num > max) max = num;
  }
  return max;
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const vLerp = (
  a: {
    [key: string]: number;
  },
  b: {
    [key: string]: number;
  },
  t: number
) => {
  let c: typeof a = {};
  for (const key in a) {
    c[key] = lerp(a[key], b[key], t);
  }

  return c;
};
export const getValueNormalized = (
  x: number,
  minX: number,
  maxX: number,
  range: [number, number] = [0, 1]
) => {
  if (minX === maxX) {
    // If all values are the same, return the midpoint of the range
    return (range[0] + range[1]) / 2;
  }
  return lerp(range[0], range[1], (x - minX) / (maxX - minX));
};
//range[0] + (range[1] - range[0]) * ((x - minX) / (maxX - minX))
export function getAngle(position1: Position, position2: Position) {
  // Calculate the differences in the x and y coordinates
  const deltaX = position2.x - position1.x;
  const deltaY = position2.y - position1.y;

  // Calculate the angle in radians
  const angleRadians = Math.atan2(deltaY, deltaX);

  // Convert the angle to degrees
  const angleDegrees = angleRadians * (180 / Math.PI);

  // Return the angle in degrees
  return angleDegrees;
}

export const generateAudioFrequency = (
  audioCtx: AudioContext,
  frequency: number = 200,
  duration: number,
  volumen = 0.1
) => {
  const osc = audioCtx.createOscillator();
  osc.frequency.value = frequency;
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
  const node = audioCtx.createGain();
  node.gain.value = volumen;
  osc.connect(node);
  node.connect(audioCtx.destination);
};
