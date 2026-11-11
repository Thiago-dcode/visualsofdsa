import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/position/Position";
import { Direction } from "@/types";
import { useAnimationSort } from "./useAnimationSort";
import { useBucketSort } from "./useBucketSort";

type Animations = ReturnType<typeof useAnimationSort>;
type Scenario = "hanging" | "detached" | "disabled" | "timed";

const never = () => new Promise<void>(() => {});

/**
 * Only the real boundary is replaced: the DOM-driven animation helpers. In "hanging" and
 * "detached" the promise never settles (animationend never fires); "disabled" mirrors the
 * early return the real helpers take when isAnimationEnabled is false.
 */
const makeAnimations = (scenario: Scenario, onMove: () => void) => {
  const wait =
    scenario === "disabled"
      ? () => Promise.resolve()
      : scenario === "timed"
        ? () => new Promise<void>((resolve) => setTimeout(resolve, 30))
        : never;
  return {
    animateNode: vi.fn(wait),
    animateSound: vi.fn(),
    animationOnMerge: vi.fn(() => {
      onMove();
      return wait();
    }),
    animationOnSlice: vi.fn(() => {
      onMove();
      return wait();
    }),
  } as unknown as Animations;
};

const makeNodes = (values: number[], attach: boolean) =>
  values.map((value, i) => {
    const ref = document.createElement("div");
    if (attach) document.body.appendChild(ref);
    return new Node(value, new Position(i * 10, 0), ref);
  });

const drive = async <T,>(promise: Promise<T>, step = 5000, max = 400) => {
  let settled = false;
  const tracked = promise.finally(() => {
    settled = true;
  });
  tracked.catch(() => {});
  for (let i = 0; i < max && !settled; i++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(step);
    });
  }
  expect(settled).toBe(true);
  return tracked;
};

const VALUES = [29, 25, 3, 49, 9, 37, 21, 43];

const setup = (scenario: Scenario, direction: Direction) => {
  const array = makeNodes(VALUES, scenario !== "detached");
  const original = array.slice();
  const intactOnMove: boolean[] = [];
  const animations = makeAnimations(scenario, () => {
    intactOnMove.push(array.every((node, i) => node === original[i]));
  });
  const announcements: string[] = [];
  const hook = renderHook(() => {
    const value = useBucketSort({
      array,
      speed: 4,
      direction,
      visualization: "bars",
      animations,
    });
    announcements.push(value.announcement);
    return value;
  });
  return { array, original, intactOnMove, announcements, hook };
};

describe("useBucketSort placement never hangs", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it.each([
    ["hanging", "ascending"],
    ["hanging", "descending"],
    ["detached", "ascending"],
    ["disabled", "ascending"],
  ] as [Scenario, Direction][])(
    "AC-BKT-7: run() resolves and sorts when animations are %s (%s)",
    async (scenario, direction) => {
      const { array, intactOnMove, hook } = setup(scenario, direction);

      let promise!: Promise<number>;
      act(() => {
        promise = hook.result.current.run();
      });
      const steps = await drive(promise);

      const expected = [...VALUES].sort((a, b) => (direction === "ascending" ? a - b : b - a));
      expect(array.map((node) => node.data)).toEqual(expected);
      expect(steps).toBeGreaterThan(0);
      expect(hook.result.current.aux.phase).toBe("done");
      expect(hook.result.current.announcement).toMatch(/^Bucket sort complete/);

      // Bars are only swapped into the live array at the very end, never mid-run.
      expect(intactOnMove.length).toBeGreaterThan(0);
      expect(intactOnMove.every(Boolean)).toBe(true);
    },
  );
});

const VALUES_B = [12, 44, 3, 31, 27, 8, 50];

const spyOf = (animations: Animations) =>
  animations as unknown as Record<
    "animateNode" | "animateSound" | "animationOnMerge" | "animationOnSlice",
    Mock
  >;

const callCounts = (animations: Animations) => {
  const s = spyOf(animations);
  return [s.animateNode, s.animateSound, s.animationOnMerge, s.animationOnSlice].map(
    (fn) => fn.mock.calls.length,
  );
};

const total = (animations: Animations) => callCounts(animations).reduce((a, b) => a + b, 0);

/** Elements (refs) reachable from a mocked animation call: a ref, a Node, or an array of Nodes. */
const refsOf = (args: unknown[]) => {
  const found: unknown[] = [];
  const visit = (value: unknown) => {
    if (value instanceof HTMLElement) found.push(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value instanceof Node) found.push(value.ref);
  };
  args.forEach(visit);
  return found;
};

/** Starts a run and advances time until it has done some animation work but is not finished. */
const startMidRun = async (animations: Animations, start: () => Promise<number>) => {
  let settled = false;
  let promise!: Promise<number>;
  act(() => {
    promise = start();
  });
  promise.then(
    () => {
      settled = true;
    },
    () => {
      settled = true;
    },
  );
  for (let i = 0; i < 500 && total(animations) < 3; i++) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5);
    });
  }
  expect(total(animations)).toBeGreaterThanOrEqual(3);
  expect(settled).toBe(false);
  return { promise };
};

describe("useBucketSort run guard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  const params = (array: Node<number>[], animations: Animations) => ({
    array,
    speed: 4 as const,
    direction: "ascending" as Direction,
    visualization: "bars" as const,
    animations,
  });

  it("AC-BKT-7 run guard: unmount mid-run aborts quietly, resolves 0, and leaves the array untouched", async () => {
    const array = makeNodes(VALUES, true);
    const original = array.slice();
    const animations = makeAnimations("timed", () => {});
    const hook = renderHook(() => useBucketSort(params(array, animations)));

    const { promise } = await startMidRun(animations, () => hook.result.current.run());
    const before = callCounts(animations);
    hook.unmount();

    const steps = await drive(promise);
    expect(steps).toBe(0);
    // Not a single sound or animation after the unmount, even though timers kept running.
    expect(callCounts(animations)).toEqual(before);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60000);
    });
    expect(callCounts(animations)).toEqual(before);
    // The sorted write-back never happened.
    expect(array.every((node, i) => node === original[i])).toBe(true);
    expect(array.map((node) => node.data)).toEqual(VALUES);
  });

  it("AC-BKT-7 run guard: reset() mid-run aborts the old run; a new run on the new array completes", async () => {
    const oldArray = makeNodes(VALUES, true);
    const newArray = makeNodes(VALUES_B, true);
    const oldOriginal = oldArray.slice();
    const animations = makeAnimations("timed", () => {});
    const hook = renderHook(({ array }) => useBucketSort(params(array, animations)), {
      initialProps: { array: oldArray },
    });

    const { promise: oldRun } = await startMidRun(animations, () => hook.result.current.run());
    act(() => {
      hook.result.current.reset();
    });
    expect(hook.result.current.aux.phase).toBe("idle");
    expect(hook.result.current.announcement).toBe("");

    const callsAtReset = spyOf(animations).animateNode.mock.calls.length;
    const sliceAtReset = spyOf(animations).animationOnSlice.mock.calls.length;
    const mergeAtReset = spyOf(animations).animationOnMerge.mock.calls.length;
    hook.rerender({ array: newArray });
    let newRun!: Promise<number>;
    act(() => {
      newRun = hook.result.current.run();
    });

    const oldSteps = await drive(oldRun);
    const newSteps = await drive(newRun);

    expect(oldSteps).toBe(0);
    expect(newSteps).toBeGreaterThan(0);
    expect(newArray.map((node) => node.data)).toEqual([...VALUES_B].sort((a, b) => a - b));
    expect(oldArray.every((node, i) => node === oldOriginal[i])).toBe(true);
    expect(oldArray.map((node) => node.data)).toEqual(VALUES);
    // The new run owns aux and the announcement.
    expect(hook.result.current.aux.phase).toBe("done");
    expect(hook.result.current.announcement).not.toBe("");

    // After the reset, the stale run never animated any bar of the old array.
    const oldRefs = new Set<unknown>(oldArray.map((node) => node.ref));
    const s = spyOf(animations);
    const later = [
      ...s.animateNode.mock.calls.slice(callsAtReset),
      ...s.animationOnSlice.mock.calls.slice(sliceAtReset),
      ...s.animationOnMerge.mock.calls.slice(mergeAtReset),
    ];
    expect(later.length).toBeGreaterThan(0);
    for (const call of later) {
      for (const ref of refsOf(call)) expect(oldRefs.has(ref)).toBe(false);
    }
  });

  it("AC-BKT-7 run guard: a Strict Mode mount/unmount/mount cycle still lets a normal run complete", async () => {
    const array = makeNodes(VALUES, true);
    const animations = makeAnimations("timed", () => {});
    const hook = renderHook(() => useBucketSort(params(array, animations)), {
      wrapper: StrictMode,
    });

    let promise!: Promise<number>;
    act(() => {
      promise = hook.result.current.run();
    });
    const steps = await drive(promise);

    expect(steps).toBeGreaterThan(0);
    expect(array.map((node) => node.data)).toEqual([...VALUES].sort((a, b) => a - b));
    expect(hook.result.current.aux.phase).toBe("done");
  });

  it("AC-BKT-7 run guard: a run started after an earlier run was aborted by unmount of a previous hook instance is unaffected", async () => {
    const first = makeNodes(VALUES, true);
    const animationsA = makeAnimations("timed", () => {});
    const a = renderHook(() => useBucketSort(params(first, animationsA)));
    const { promise: aborted } = await startMidRun(animationsA, () => a.result.current.run());
    a.unmount();

    const second = makeNodes(VALUES, true);
    const animationsB = makeAnimations("timed", () => {});
    const b = renderHook(() => useBucketSort(params(second, animationsB)));
    let promise!: Promise<number>;
    act(() => {
      promise = b.result.current.run();
    });
    const [abortedSteps, steps] = [await drive(aborted), await drive(promise)];

    expect(abortedSteps).toBe(0);
    expect(steps).toBeGreaterThan(0);
    expect(second.map((node) => node.data)).toEqual([...VALUES].sort((a, b) => a - b));
  });
});
