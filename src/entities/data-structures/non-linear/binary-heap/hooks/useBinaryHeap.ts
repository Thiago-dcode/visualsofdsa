import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useAnimation from "@/hooks/useAnimation";
import { useSoundAnimation } from "@/hooks/useSoundAnimation";
import { animate } from "@/lib/animations";
import { Edge } from "@/lib/classes/Edge";
import { random } from "@/lib/utils";
import { speed } from "@/types";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import TreeLayout from "../../tree/_classes/TreeLayout";
import { BinaryHeap, type HeapHooks, type HeapMode } from "../classes/BinaryHeap";

export const MAX_HEAP_SIZE = 31;
const MIN_INPUT_VALUE = -1000;
const MAX_INPUT_VALUE = 1000;
const RANDOM_RANGE: [number, number] = [0, 99];
const INSERT_DURATION = 0.8;
const INSERT_WAIT_FALLBACK_MS = 3000;
const STEP_DURATION: Record<speed, number> = { 1: 0.8, 2: 0.5, 3: 0.3, 4: 0.2 };

export type HeapHighlightKind = "compare" | "swap" | "root" | null;
export type HeapHighlight = { indices: number[]; kind: HeapHighlightKind };
const NO_HIGHLIGHT: HeapHighlight = { indices: [], kind: null };

const extremeName = (mode: HeapMode) => (mode === "min" ? "minimum" : "maximum");
const levels = (n: number) => `${n} level${n === 1 ? "" : "s"}`;

export const useBinaryHeap = (speed: speed) => {
  const [heap] = useState(() => new BinaryHeap("min"));
  const [treeLayout, setTreeLayout] = useState(
    () => new TreeLayout<number, BinaryTreeNode<number>>(heap.toTreeView()),
  );
  const [array, setArray] = useState<number[]>([]);
  const [mode, setModeState] = useState<HeapMode>("min");
  const [lastOperation, setLastOperation] = useState("");
  const [highlight, setHighlight] = useState<HeapHighlight>(NO_HIGHLIGHT);
  const { animateSound } = useSoundAnimation();
  const { isAnimationEnabled, animateEdge } = useAnimation();

  // Operations are long running: read the latest switch value, not the one captured at start.
  const enabledRef = useRef(isAnimationEnabled);
  enabledRef.current = isAnimationEnabled;
  const insertDone = useRef<(() => void) | null>(null);

  // On unmount: stop animating and release a pending insert wait (this also clears its timer),
  // so nothing fires on the unmounted hook.
  // The body re-arms the flag so a Strict Mode mount/unmount/mount cycle keeps animations on.
  useEffect(() => {
    enabledRef.current = isAnimationEnabled;
    return () => {
      enabledRef.current = false;
      insertDone.current?.();
      insertDone.current = null;
    };
  }, []);

  const render = () => {
    setTreeLayout(new TreeLayout<number, BinaryTreeNode<number>>(heap.toTreeView()));
    setArray(heap.toArray());
  };

  const pulse = async (indices: number[], name: string, duration: number) => {
    if (!enabledRef.current) return;
    await Promise.all(indices.map((i) => animate(heap.nodeAt(i)?.ref ?? null, name, duration)));
  };
  const playSound = (index: number) => {
    const values = heap.toArray();
    const value = values[index];
    if (value === undefined) return;
    animateSound(value, Math.min(...values), Math.max(...values));
  };

  const makeHooks = (counter: { swaps: number }): HeapHooks => ({
    onAdd: async (index) => {
      const node = heap.nodeAt(index);
      if (!node || !enabledRef.current) {
        render();
        return;
      }
      // The node must be mounted before it can be animated: wait for its insert animation.
      const mounted = new Promise<void>((resolve) => {
        const fallback = window.setTimeout(resolve, INSERT_WAIT_FALLBACK_MS);
        insertDone.current = () => {
          window.clearTimeout(fallback);
          resolve();
        };
      });
      node.isLastAdd = true;
      render();
      await mounted;
    },
    onCompare: async (i, j) => {
      setHighlight({ indices: [i, j], kind: "compare" });
      if (!enabledRef.current) return;
      playSound(i);
      await pulse([i, j], "compare-node", STEP_DURATION[speed]);
    },
    onSwap: async (i, j) => {
      counter.swaps++;
      setHighlight({ indices: [i, j], kind: "swap" });
      if (!enabledRef.current) return;
      await pulse([i, j], "swap-node", STEP_DURATION[speed] * 1.5);
      render();
    },
    onSetRoot: async () => {
      setHighlight({ indices: [0], kind: "root" });
      if (!enabledRef.current) return;
      render();
      await pulse([0], "swap-node", STEP_DURATION[speed] * 1.5);
    },
  });

  const finish = (message: string) => {
    setHighlight(NO_HIGHLIGHT);
    render();
    setLastOperation(message);
  };

  /** Passed to TreeVisualization: runs when the freshly appended node is mounted. */
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    node.isLastAdd = false;
    if (enabledRef.current) await animate(node.ref, "insert-node", INSERT_DURATION);
    insertDone.current?.();
    insertDone.current = null;
  };
  const onCreateEdgeAnimation = async (edge: Edge) => {
    await animateEdge(edge, 0.5, true);
  };

  const insert = async (value: number): Promise<boolean> => {
    if (heap.size >= MAX_HEAP_SIZE) {
      toast.error(`The heap is limited to ${MAX_HEAP_SIZE} values so the tree stays legible`);
      return false;
    }
    const counter = { swaps: 0 };
    const { index } = await heap.insert(value, makeHooks(counter));
    const tail =
      heap.size === 1
        ? ", it is the root"
        : `, sifted up ${levels(counter.swaps)}${index === 0 ? `, new ${extremeName(heap.mode)}` : ""}`;
    finish(`Inserted ${value}${tail}`);
    return true;
  };

  const extract = async (): Promise<number | null> => {
    if (heap.size === 0) {
      setLastOperation("The heap is empty, nothing to extract");
      return null;
    }
    const counter = { swaps: 0 };
    const value = await heap.extract(makeHooks(counter));
    const root = heap.peek();
    finish(
      root === null
        ? `Extracted ${value}, the heap is now empty`
        : `Extracted ${value}, sifted down ${levels(counter.swaps)}, new root ${root}`,
    );
    return value;
  };

  const peek = async (): Promise<number | null> => {
    const value = heap.peek();
    if (value === null) {
      setLastOperation("The heap is empty, nothing to peek");
      return null;
    }
    setHighlight({ indices: [0], kind: "root" });
    if (enabledRef.current) {
      playSound(0);
      await pulse([0], "find-node", STEP_DURATION[speed] * 2);
    }
    setHighlight(NO_HIGHLIGHT);
    setLastOperation(`The root is ${value}, the ${extremeName(heap.mode)}`);
    return value;
  };

  const buildRandom = async (size: number): Promise<boolean> => {
    if (!Number.isInteger(size) || size < 1 || size > MAX_HEAP_SIZE) {
      toast.error(`Heap size must be a whole number between 1 and ${MAX_HEAP_SIZE}`);
      return false;
    }
    const values = Array.from({ length: size }, () => random(RANDOM_RANGE[0], RANDOM_RANGE[1]));
    await heap.buildHeap(values);
    finish(`Built a ${heap.mode} heap from ${size} random values, root ${heap.peek()}`);
    return true;
  };

  const setMode = async (next: HeapMode) => {
    if (next === heap.mode) return;
    await heap.setMode(next);
    setModeState(next);
    const root = heap.peek();
    finish(
      root === null ? `Switched to a ${next} heap` : `Switched to a ${next} heap, new root ${root}`,
    );
  };

  const clear = () => {
    heap.clear();
    finish("The heap was cleared");
  };

  return {
    treeLayout,
    array,
    mode,
    lastOperation,
    highlight,
    size: array.length,
    height: heap.height,
    root: array.length > 0 ? array[0] : null,
    indexOf: (node: BinaryTreeNode<number>) => heap.indexOf(node),
    insert,
    extract,
    peek,
    buildRandom,
    setMode,
    clear,
    onInsertAnimation,
    onCreateEdgeAnimation,
    maxHeapSize: MAX_HEAP_SIZE,
    minInputValue: MIN_INPUT_VALUE,
    maxInputValue: MAX_INPUT_VALUE,
  };
};
