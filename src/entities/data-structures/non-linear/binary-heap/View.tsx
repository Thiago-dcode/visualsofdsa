"use client";
import { useRef } from "react";
import "@/entities/data-structures/non-linear/tree/animation.css";
import "./animation.css";
import OperationAnnouncer from "@/components/app/OperationAnnouncer";
import Properties from "@/components/app/Properties";
import SpeedComponent from "@/components/app/speedComponent";
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer";
import OperationsContainer from "@/components/container/OperationsContainer";
import Section from "@/components/container/Section";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { config } from "@/config";
import { useAnimationRunning } from "@/context/animationRunningContext";
import { useSpeed } from "@/hooks/useSpeed";
import { useToast } from "@/hooks/useToast";
import ButtonAction from "../../linear/_components/ButtonAction";
import BinaryTreeNode from "../tree/_classes/BinaryTreeNode";
import TreeVisualization from "../tree/_components/visualizations/treeVisualization";
import HeapArrayStrip from "./components/HeapArrayStrip";
import HeapIndexBadge from "./components/HeapIndexBadge";
import { useBinaryHeap } from "./hooks/useBinaryHeap";

const TOUCH_TARGET = "h-11 min-w-11";

function BinaryHeapView() {
  const { toastInfo } = useToast();
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
  const { speed, handleSetSpeed } = useSpeed(3, config.localStorageKeys.speed.binaryHeap);
  const {
    treeLayout,
    array,
    mode,
    lastOperation,
    highlight,
    size,
    height,
    root,
    indexOf,
    insert,
    extract,
    peek,
    buildRandom,
    setMode,
    clear,
    onInsertAnimation,
    onCreateEdgeAnimation,
    maxHeapSize,
    minInputValue,
    maxInputValue,
  } = useBinaryHeap(speed);
  const insertInputRef = useRef<HTMLInputElement>(null);
  const buildInputRef = useRef<HTMLInputElement>(null);
  const isMin = mode === "min";

  const run = async (operation: () => Promise<unknown>) => {
    if (isAnimationRunning) return;
    setAnimationRunning(true);
    try {
      await operation();
    } finally {
      setAnimationRunning(false);
    }
  };

  const handleInsert = async () => {
    const input = insertInputRef.current;
    if (!input || isAnimationRunning) return;
    const num = parseFloat(input.value);
    if (Number.isNaN(num) || num < minInputValue || num > maxInputValue) {
      toastInfo(`Input must be a number between ${minInputValue} and ${maxInputValue}`);
      return;
    }
    await run(async () => {
      if (await insert(num)) input.value = "";
    });
  };

  const handleBuild = async () => {
    const input = buildInputRef.current;
    if (!input || isAnimationRunning) return;
    const num = parseFloat(input.value);
    if (Number.isNaN(num) || num < 1 || num > maxHeapSize) {
      toastInfo(`Input must be a number between 1 and ${maxHeapSize}`);
      return;
    }
    await run(async () => {
      if (await buildRandom(num)) input.value = "";
    });
  };

  return (
    <div className="heap-view contents">
      <OperationsContainer>
        <Section>
          <InputWithButtonContainer>
            <Input
              ref={insertInputRef}
              aria-label="Value to insert"
              placeholder="number"
              min={minInputValue}
              max={maxInputValue}
              className="text-black w-32 h-11 text-center"
              type="number"
            />
            <ButtonAction
              title="Insert"
              action="insert"
              className={TOUCH_TARGET}
              isLoading={isAnimationRunning}
              onClick={handleInsert}
            />
          </InputWithButtonContainer>

          <ButtonAction
            title={isMin ? "Extract min" : "Extract max"}
            action="delete"
            className={TOUCH_TARGET}
            isLoading={isAnimationRunning}
            onClick={() => run(extract)}
          />
          <ButtonAction
            title="Peek"
            action="search"
            className={TOUCH_TARGET}
            isLoading={isAnimationRunning}
            onClick={() => run(peek)}
          />

          <div className="flex items-center gap-2 h-11">
            <span id="heap-mode-label" className="text-sm font-semibold">
              {isMin ? "Min heap" : "Max heap"}
            </span>
            <Switch
              aria-labelledby="heap-mode-label"
              checked={!isMin}
              disabled={isAnimationRunning}
              onCheckedChange={(checked) => run(() => setMode(checked ? "max" : "min"))}
            />
            <span className="text-xs">(switch on for max)</span>
          </div>

          <InputWithButtonContainer>
            <Input
              ref={buildInputRef}
              aria-label="Number of random values"
              placeholder="size"
              min={1}
              max={maxHeapSize}
              className="text-black w-32 h-11 text-center"
              type="number"
            />
            <ButtonAction
              title="Build random heap"
              action="fill"
              className={TOUCH_TARGET}
              isLoading={isAnimationRunning}
              onClick={handleBuild}
            />
          </InputWithButtonContainer>

          {size > 0 && (
            <ButtonAction
              title="Clear"
              action="delete"
              className={TOUCH_TARGET}
              isLoading={isAnimationRunning}
              onClick={() => run(async () => clear())}
            />
          )}
        </Section>
      </OperationsContainer>

      <div className="w-full items-end justify-between flex flex-wrap gap-4">
        <Properties
          properties={{
            size: { value: `${size} / ${maxHeapSize}` },
            height: { value: height },
            mode: { value: mode },
            root: { value: root, show: root !== null },
          }}
        />
        <div className="pr-4 w-44 max-w-full">
          <SpeedComponent title="Animation Speed" speed={speed} setSpeed={handleSetSpeed} />
        </div>
      </div>

      <OperationAnnouncer message={lastOperation} />
      <HeapArrayStrip array={array} highlight={highlight} />

      <TreeVisualization<number, BinaryTreeNode<number>>
        onInsertAnimation={onInsertAnimation}
        onCreateEdgeAnimation={onCreateEdgeAnimation}
        treeLayout={treeLayout}
        nodeSize={40}
        renderBadge={(node) => {
          const index = indexOf(node);
          return (
            <HeapIndexBadge
              index={index}
              tag={highlight.indices.includes(index) ? highlight.kind : null}
            />
          );
        }}
      />
    </div>
  );
}

export default BinaryHeapView;
