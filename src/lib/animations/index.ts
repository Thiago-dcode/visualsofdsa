
import { onAnimationEnds } from '@/types';
import './style.css'



  export const animate = async (
    ref: HTMLElement | null,
    animation:string,
    speed:number,
    settings?:{
       properties?:{
        [key: string]: string;
       },
       onAnimationEnds?: onAnimationEnds  | null,
       onlyOnce?: boolean
    },
  ): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      if (ref === null) {
        resolve(false);
      } else {
        const {properties,onAnimationEnds,onlyOnce} = settings || {};
        const onAnimationEventEnds = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e,ref);
          }
  
          if (ref)
           ref.removeEventListener("animationend", onAnimationEventEnds);
  
          resolve(true);
        };
        if(properties){
          Object.entries(properties).forEach(([key, value]) => {
            ref.style.setProperty(`--${key}`, value);
          });
    
        }
        requestAnimation(ref, `${animation} ${speed}s`, onAnimationEventEnds,onlyOnce);
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