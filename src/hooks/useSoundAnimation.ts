import { useRef } from "react";
import { useMuted } from "@/context/muteContext";
import { generateAudioFrequency, getValueNormalized, lerp } from "@/lib/utils";

export const useSoundAnimation = () => {
  const audioCtx = useRef<AudioContext | null>(null);
  const { isMuted } = useMuted();

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
    if (isNaN(normalizedFrequency)) return;
    generateAudioFrequency(audioCtx.current!, normalizedFrequency, 0.3);
  };
  return {
    animateSound
  }
}

