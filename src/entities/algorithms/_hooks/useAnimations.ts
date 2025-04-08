import { animate } from "@/lib/animations";
import { lerp, getValueNormalized, generateAudioFrequency } from "@/lib/utils";
import { speed, VisualizationArrays } from "@/types";
import { useRef } from "react";
import "../animation.css";
import { useMuted } from "@/context/muteContext";

export const useAnimation = (visualizationMode: VisualizationArrays) => {
  const audioCtx = useRef<AudioContext | null>(null);
  const { isMuted } = useMuted();
  const getIndexRef = (ref: HTMLElement) =>
    ref.parentElement?.parentElement?.children[2] as HTMLElement;
  const animateSound = (x: number, minX: number, maxX: number) => {
    if (isMuted) return;
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }

    const normalizedFrequency = lerp(
      200,
      700,
      getValueNormalized(x, minX, maxX)
    );
    generateAudioFrequency(audioCtx.current!, normalizedFrequency, 0.3);
  };

  const animateNode = async (
    ref: HTMLElement,
    animation: string,
    speed: number
  ) => {
    const indexRef = getIndexRef(ref);
    if (indexRef && visualizationMode === "memoryRam") {
      indexRef.style.visibility = "visible";
    }
    await animate(
      ref,
      `${animation}-node`,
      speed,
      (e) => {
        if (indexRef && visualizationMode === "memoryRam") {
          indexRef.style.visibility = "hidden";
        }
      }
    );
  };

  return {
    animateNode,
    animateSound,
    getIndexRef,
  };
};
