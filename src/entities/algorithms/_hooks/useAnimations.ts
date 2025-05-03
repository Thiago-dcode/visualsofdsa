import { animate } from "@/lib/animations";
import { VisualizationArrays } from "@/types";
import "../animation.css";
import { useSoundAnimation } from "../../../hooks/useSoundAnimation";
import useBaseAnimation from "../../../hooks/useAnimation";
export const useAnimation = (visualizationMode: VisualizationArrays) => {
  const { animateSound } = useSoundAnimation();
  const { focus,isAnimationEnabled } = useBaseAnimation()
  const getIndexRef = (ref: HTMLElement) =>
    ref.parentElement?.parentElement?.children[2] as HTMLElement;


  const animateNode = async (
    ref: HTMLElement,
    animation: string,
    speed: number
  ) => {
    if(!isAnimationEnabled) return;
    const indexRef = getIndexRef(ref);
    if (indexRef && visualizationMode === "memoryRam") {
      indexRef.style.visibility = "visible";
    }
    if (visualizationMode === 'memoryRam') focus(ref)
    await animate(
      ref,
      `${animation}-node`,
      speed,
      {
        onAnimationEnds: () => {
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
    isAnimationEnabled
  };
};
