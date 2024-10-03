import { Position, Primitive, speed } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuid4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
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

export const requestAnimation = function (
  ref: HTMLElement,
  animation: string,
  animationEvent: (e: AnimationEvent) => void
) {
  ref.style.animation = "none";
  ref.offsetHeight;

  window.requestAnimationFrame(function () {
    ref.style.animation = animation;
  });
  ref.addEventListener("animationend", animationEvent);
};

export const prefix0 = (n: number): string => {
  if (n < 10) {
    return "0" + n;
  }
  return n + "";
};
export const getMemoryAddress = (index: number) => {
  return '0x' + prefix0(index);
}
export const generateKey = (pre: Primitive = "") => {
  return `${pre}_${uuid4()}`;
};
export function removePx(value: string): number {
  if (!value) return 0;
  const result = parseFloat(value.replace(/px$/, ""));
  return isNaN(result) ? 0 : result;
}
export function getEuclideanDistance(position1: Position, position2: Position) {

  return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2))

}

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