import { animate } from "@/lib/animations";
import { lerp, getValueNormalized, generateAudioFrequency } from "@/lib/utils";
import { speed, VisualizationArrays } from "@/types";
import { useRef } from "react";

const getIndexRef = (ref: HTMLElement) =>
  ref.parentElement?.parentElement?.children[2] as HTMLElement;
const getSpeed = (type: AlgoSearchType, speed: number) => {
  switch (speed) {
    case 1:
      return type === "linear" ? 0.5 : 1;
    case 2:
      return type === "linear" ? 0.3 : 0.7;
    case 3:
      return type === "linear" ? 0.1 : 0.5;
  }
};

export const useAnimation = () => {
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
    found: boolean,
    type: AlgoSearchType,
    visualizationMode: VisualizationArrays,
    speed: speed
  ) => {
    const indexRef = getIndexRef(ref);
    if (indexRef && visualizationMode === "memoryRam") {
      indexRef.style.visibility = "visible";
    }

    try {
      await animate(
        ref,
        !found ? `search-node ${getSpeed(type, speed)}s` : `access-node ${2}s`,
        (e) => {
          if (indexRef && visualizationMode === "memoryRam") {
            console.log("hidden something;");
            indexRef.style.visibility = "hidden";
          }
        }
      );
    } catch (error) {
      console.error("###ERROR ANIMATING LINEAR SEARCH ALGORITHM###");
    }
  };

  return {
    animateNode,
    animateSound,

  };
};
