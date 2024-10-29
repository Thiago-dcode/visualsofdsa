
import { requestAnimation } from "../utils";
import './style.css'


  export const animate = async (
    ref: HTMLElement | null,
    animation:string,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
  onlyOnce = false
  ): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      if (ref === null) {
        reject(false);
      } else {
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
  
          if (ref)
           ref.removeEventListener("animationend", animationEvent);
  
          resolve(true);
        };
        requestAnimation(ref, animation, animationEvent,onlyOnce);
      }
    });
  };
  