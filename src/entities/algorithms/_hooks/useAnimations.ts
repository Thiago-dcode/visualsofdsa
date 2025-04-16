import { animate } from "@/lib/animations";
import { VisualizationArrays } from "@/types";
import "../animation.css";
import { useSoundAnimation } from "../../../hooks/useSoundAnimation";

export const useAnimation = (visualizationMode: VisualizationArrays) => {
  const {animateSound} = useSoundAnimation();
  const getIndexRef = (ref: HTMLElement) =>
    ref.parentElement?.parentElement?.children[2] as HTMLElement;


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
      {
        onAnimationEnds:  () => {
          if (indexRef && visualizationMode === "memoryRam") {
            indexRef.style.visibility = "hidden";
          }
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
