import { VisualizationArrays } from "@/types";
import { config } from "@/config";
import { useEffect, useState } from "react";

export const useVisualizationArray = (defaultMode: VisualizationArrays) => {
  const [visualizationMode, setVisualizationMode] =
    useState<VisualizationArrays>(defaultMode);
  const handleSetVisualizationMode = (vimValue: VisualizationArrays) => {
    localStorage.setItem(
      config.localStorageKeys.visualizationMode.array,
      vimValue
    );
    setVisualizationMode(vimValue);
  };
  useEffect(() => {
    if (!window) return;
    const visualization = localStorage.getItem(
      config.localStorageKeys.visualizationMode.array
    ) as VisualizationArrays | null;
    if (visualization) setVisualizationMode(visualization);
  }, []);

  return {
    visualizationMode,
    handleSetVisualizationMode,
  };
};
