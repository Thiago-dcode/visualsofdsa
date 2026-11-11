import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/position/Position";
import { useSortAlgorithms } from "./useSortAlgorithms";

// Only the DOM-driven animation boundary is replaced; animations finish after a short tick.
vi.mock("./useAnimationSort", () => {
  const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 30));
  return {
    useAnimationSort: () => ({
      animateNode: tick,
      animateSound: () => {},
      animateOnSwap: tick,
      animationOnMerge: tick,
      animationOnSlice: tick,
    }),
  };
});

const makeNodes = (values: number[]) =>
  values.map((value, i) => {
    const ref = document.createElement("div");
    document.body.appendChild(ref);
    return new Node(value, new Position(i * 10, 0), ref);
  });

const VALUES = [14, 3, 22, 9, 3, 17, 1];

const drive = async <T,>(promise: Promise<T>) => {
  let settled = false;
  const tracked = promise.finally(() => {
    settled = true;
  });
  tracked.catch(() => {});
  for (let i = 0; i < 400 && !settled; i++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
  }
  expect(settled).toBe(true);
  return tracked;
};

const midRun = async (start: () => Promise<boolean>) => {
  let promise!: Promise<boolean>;
  act(() => {
    promise = start();
  });
  // Let the run get going but not finish.
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  return { promise };
};

describe.each(["counting", "radix", "bucket"] as const)(
  "useSortAlgorithms %s run guard",
  (name) => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
      document.body.innerHTML = "";
    });

    const setup = () => {
      const array = makeNodes(VALUES);
      const hook = renderHook(() => useSortAlgorithms(array, 4, "ascending", "bars"));
      return { array, hook };
    };

    it(`AC-INT-1: ${name}() reports steps and sets the message after a normal run`, async () => {
      const { hook } = setup();
      let promise!: Promise<boolean>;
      act(() => {
        promise = hook.result.current[name]();
      });
      expect(await drive(promise)).toBe(true);
      expect(hook.result.current.isSorted).toBe(true);
      expect(hook.result.current.message?.title).toBe("STEPS TAKEN");
    });

    it(`AC-INT-1: ${name}() returns false and skips onSortEnds when the page unmounts mid-run`, async () => {
      const { hook } = setup();
      const { promise } = await midRun(() => hook.result.current[name]());
      hook.unmount();

      expect(await drive(promise)).toBe(false);
      // Last rendered state: no "STEPS TAKEN" message and not marked sorted.
      expect(hook.result.current.message).toBeNull();
      expect(hook.result.current.isSorted).toBe(false);
    });

    it(`AC-INT-1: ${name}() returns false and skips onSortEnds after resetAux() mid-run`, async () => {
      const { hook } = setup();
      const { promise } = await midRun(() => hook.result.current[name]());
      act(() => {
        hook.result.current.resetAux();
      });

      expect(await drive(promise)).toBe(false);
      expect(hook.result.current.message).toBeNull();
      expect(hook.result.current.isSorted).toBe(false);
    });
  },
);
