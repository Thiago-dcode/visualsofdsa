import { animate } from "@/lib/animations";
import { lerp, getValueNormalized, generateAudioFrequency } from "@/lib/utils";
import { speed, VisualizationArrays } from "@/types";
import { useRef } from "react";
import { AlgoSearchType } from "../types";
import '../animation.css'

const getIndexRef = (ref: HTMLElement) =>
  ref.parentElement?.parentElement?.children[2] as HTMLElement;


export const useAnimation = (visualizationMode: VisualizationArrays) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const animateSound = (x: number, minX: number, maxX: number) => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }

    const normalizedFrequency = lerp(
      200,
      700,
      getValueNormalized(x, minX, maxX)
    );
    generateAudioFrequency(audioCtx.current!, normalizedFrequency,0.3);
  };

  const animateNode = async (
    ref: HTMLElement,
    animation:string,
    speed:number
  
  ) => {
    const indexRef = getIndexRef(ref);
    if (indexRef && visualizationMode === "memoryRam") {
      indexRef.style.visibility = "visible";
    }
      await animate(
        ref,
        
      `${animation}-node ${speed}s`,
        (e) => {
          if (indexRef && visualizationMode === "memoryRam") {
            indexRef.style.visibility = "hidden";
          }
        },
      
      );
  
  };
 

  return {
    animateNode,
    animateSound,


  };
};
