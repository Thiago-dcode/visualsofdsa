import React from "react";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction, VisualizationArrays } from "@/types";
import BarVisualization from "./barVisualization";
import MemoryRamVisualization from "./memoryRamVisualization";

export default function RenderVisualization({
  array,
  setAnimationRunning,
  visualizationMode,
  sorted,
  direction,
  maxBarSize,
}: {
  array: Node<number>[];
  setAnimationRunning: (e: boolean) => void;
  visualizationMode: VisualizationArrays;
  sorted: boolean;
  direction?: Direction;
  maxBarSize?: number;
}) {
  const render = () => {
    switch (visualizationMode) {
      case "memoryRam":
        return <MemoryRamVisualization array={array} setAnimationRunning={setAnimationRunning} />;
      case "bars":
        return (
          <BarVisualization
            maxBarSize={maxBarSize}
            arrayIsSorted={sorted}
            direction={direction}
            array={array}
          />
        );
      default:
        return null;
    }
  };
  return render();
}
