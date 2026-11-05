import { useEffect, useState } from "react";
import { config } from "@/config";
import { VisualizationArrays } from "@/types";

export const useVisualizationArray = (
  defaultMode: VisualizationArrays,
  onVisualizationChange?: (vimValue: VisualizationArrays) => Promise<void>,
) => {
  const [visualizationMode, setVisualizationMode] = useState<VisualizationArrays>(defaultMode);
  const handleSetVisualizationMode = async (vimValue: VisualizationArrays) => {
    if (onVisualizationChange) await onVisualizationChange(vimValue);
    localStorage.setItem(config.localStorageKeys.visualizationMode.array, vimValue);
    setVisualizationMode(vimValue);
  };
  useEffect(() => {
    if (!window) return;
    const visualization = localStorage.getItem(
      config.localStorageKeys.visualizationMode.array,
    ) as VisualizationArrays | null;
    if (visualization) setVisualizationMode(visualization);
  }, []);

  return {
    visualizationMode,
    handleSetVisualizationMode,
  };
};
