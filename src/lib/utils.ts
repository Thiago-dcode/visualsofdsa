import { speed } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
