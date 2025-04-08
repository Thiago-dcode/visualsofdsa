
import { onAnimationEnds } from '@/types';
import './style.css'



  export const animate = async (
    ref: HTMLElement | null,
    animation:string,
    speed:number,
    onAnimationEnds: onAnimationEnds  | null = null,
    onlyOnce = false
  ): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      if (ref === null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e,ref);
          }
  
          if (ref)
           ref.removeEventListener("animationend", animationEvent);
  
          resolve(true);
        };
        requestAnimation(ref, `${animation} ${speed}s`, animationEvent,onlyOnce);
      }
    });
  };
  export const requestAnimation = function (
    ref: HTMLElement,
    animation: string,
    animationEvent: (e: AnimationEvent) => void,
    onlyOnce = false
  ) {
    if (!onlyOnce) {
      ref.style.animation = "none";
      ref.offsetHeight;
    }
    window.requestAnimationFrame(function () {
      ref.style.animation = animation;
    });
    ref.addEventListener("animationend", animationEvent);
  };