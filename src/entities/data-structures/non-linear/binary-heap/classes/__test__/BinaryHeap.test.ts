import { BinaryHeap, HeapMode } from "../BinaryHeap";

const isHeap = (arr: number[], mode: HeapMode) => {
  for (let i = 1; i < arr.length; i++) {
    const p = arr[BinaryHeap.parent(i)];
    if (mode === "min") {
      if (p > arr[i]) return false;
    } else if (p < arr[i]) return false;
  }
  return true;
};

const fill = async (values: number[], mode: HeapMode = "min") => {
  const heap = new BinaryHeap(mode);
  for (const v of values) await heap.insert(v);
  return heap;
};

/** Tree view must mirror the array (index wired, parents coherent). */
const assertTreeView = (heap: BinaryHeap) => {
  const view = heap.toTreeView();
  expect(view.size).toBe(heap.size);
  if (heap.size === 0) {
    expect(view.root).toBeNull();
    return;
  }
  expect(view.root).toBe(heap.nodeAt(0));
  for (let i = 0; i < heap.size; i++) {
    const node = heap.nodeAt(i);
    expect(node).not.toBeNull();
    expect(node?.data).toBe(heap.toArray()[i]);
    expect(node?.isRoot).toBe(i === 0);
    const l = BinaryHeap.left(i);
    const r = BinaryHeap.right(i);
    expect(node?.left ?? null).toBe(l < heap.size ? heap.nodeAt(l) : null);
    expect(node?.right ?? null).toBe(r < heap.size ? heap.nodeAt(r) : null);
    if (i > 0) expect(node?.parent).toBe(heap.nodeAt(BinaryHeap.parent(i)));
  }
};

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe("BinaryHeap insert (AC-1)", () => {
  it("AC-HEAP-1: min mode keeps the minimum at the root and the heap property after each insert", async () => {
    const heap = new BinaryHeap("min");
    const seen: number[] = [];
    for (const v of [5, 3, 8, 1, 9, 2]) {
      await heap.insert(v);
      seen.push(v);
      expect(heap.toArray()[0]).toBe(Math.min(...seen));
      expect(isHeap(heap.toArray(), "min")).toBe(true);
    }
    assertTreeView(heap);
  });

  it("AC-HEAP-1: max mode mirrors it", async () => {
    const heap = new BinaryHeap("max");
    const seen: number[] = [];
    for (const v of [5, 3, 8, 1, 9, 2]) {
      await heap.insert(v);
      seen.push(v);
      expect(heap.toArray()[0]).toBe(Math.max(...seen));
      expect(isHeap(heap.toArray(), "max")).toBe(true);
    }
  });
});

describe("BinaryHeap extract (AC-2)", () => {
  it("AC-HEAP-2: min extract returns non-decreasing values until empty", async () => {
    const heap = await fill([5, 3, 8, 1, 9, 2, 7, 3]);
    const out: number[] = [];
    let v = await heap.extract();
    while (v !== null) {
      out.push(v);
      expect(isHeap(heap.toArray(), "min")).toBe(true);
      assertTreeView(heap);
      v = await heap.extract();
    }
    expect(out).toEqual([1, 2, 3, 3, 5, 7, 8, 9]);
    expect(heap.size).toBe(0);
  });

  it("AC-HEAP-2: max extract returns non-increasing values until empty", async () => {
    const heap = await fill([5, 3, 8, 1, 9, 2, 7, 3], "max");
    const out: number[] = [];
    let v = await heap.extract();
    while (v !== null) {
      out.push(v);
      v = await heap.extract();
    }
    expect(out).toEqual([9, 8, 7, 5, 3, 3, 2, 1]);
  });

  it("AC-HEAP-2: extract on empty returns null and does not throw", async () => {
    const heap = new BinaryHeap();
    await expect(heap.extract()).resolves.toBeNull();
    expect(heap.size).toBe(0);
  });
});

describe("BinaryHeap property loop (AC-3)", () => {
  for (const mode of ["min", "max"] as const) {
    it(`AC-HEAP-3: ${mode} heap invariant holds after 200 random inserts and extracts`, async () => {
      const rand = rng(mode === "min" ? 11 : 22);
      const heap = new BinaryHeap(mode);
      const model: number[] = [];
      for (let i = 0; i < 200; i++) {
        if (rand() < 0.6 || model.length === 0) {
          const v = Math.floor(rand() * 100);
          await heap.insert(v);
          model.push(v);
        } else {
          const got = await heap.extract();
          const sorted = [...model].sort((a, b) => (mode === "min" ? a - b : b - a));
          expect(got).toBe(sorted[0]);
          model.splice(model.indexOf(sorted[0]), 1);
        }
        expect(heap.size).toBe(model.length);
        expect(isHeap(heap.toArray(), mode)).toBe(true);
        expect([...heap.toArray()].sort((a, b) => a - b)).toEqual([...model].sort((a, b) => a - b));
      }
      assertTreeView(heap);
    });
  }
});

describe("BinaryHeap peek (AC-4)", () => {
  it("AC-HEAP-4: peek returns the root without changing the heap", async () => {
    const heap = await fill([4, 2, 9]);
    const before = heap.toArray();
    expect(heap.peek()).toBe(2);
    expect(heap.size).toBe(3);
    expect(heap.toArray()).toEqual(before);
  });

  it("AC-HEAP-4: peek on empty is null", () => {
    expect(new BinaryHeap().peek()).toBeNull();
  });
});

describe("BinaryHeap buildHeap and setMode (AC-5, AC-6)", () => {
  it("AC-HEAP-5: Floyd buildHeap([9,4,7,1,3,8]) min mode gives [1,3,7,4,9,8]", async () => {
    const heap = new BinaryHeap("min");
    await heap.buildHeap([9, 4, 7, 1, 3, 8]);
    expect(heap.toArray()).toEqual([1, 3, 7, 4, 9, 8]);
    expect(heap.size).toBe(6);
    expect(isHeap(heap.toArray(), "min")).toBe(true);
    assertTreeView(heap);
  });

  it("AC-HEAP-5: buildHeap replaces existing content (grow and shrink)", async () => {
    const heap = await fill([100, 200, 300]);
    await heap.buildHeap([9, 4, 7, 1, 3, 8]);
    expect(heap.size).toBe(6);
    assertTreeView(heap);
    await heap.buildHeap([2, 1]);
    expect(heap.size).toBe(2);
    expect(heap.toArray()).toEqual([1, 2]);
    assertTreeView(heap);
    await heap.buildHeap([]);
    expect(heap.size).toBe(0);
    assertTreeView(heap);
  });

  it("AC-HEAP-5: max mode builds a valid max heap", async () => {
    const heap = new BinaryHeap("max");
    await heap.buildHeap([9, 4, 7, 1, 3, 8]);
    expect(isHeap(heap.toArray(), "max")).toBe(true);
    expect(heap.peek()).toBe(9);
  });

  it("AC-HEAP-6: setMode re-heapifies the same multiset", async () => {
    const heap = await fill([5, 3, 8, 1, 9, 2]);
    expect(heap.peek()).toBe(1);
    await heap.setMode("max");
    expect(heap.mode).toBe("max");
    expect(heap.peek()).toBe(9);
    expect(isHeap(heap.toArray(), "max")).toBe(true);
    expect([...heap.toArray()].sort((a, b) => a - b)).toEqual([1, 2, 3, 5, 8, 9]);
    await heap.setMode("min");
    expect(heap.peek()).toBe(1);
    expect(isHeap(heap.toArray(), "min")).toBe(true);
  });

  it("AC-HEAP-6: setMode on an empty heap is harmless", async () => {
    const heap = new BinaryHeap("min");
    await heap.setMode("max");
    expect(heap.mode).toBe("max");
    expect(heap.size).toBe(0);
  });
});

describe("BinaryHeap duplicates (AC-7)", () => {
  it("AC-HEAP-7: accepts duplicates and counts them", async () => {
    const heap = await fill([3, 3, 3, 1, 1]);
    expect(heap.size).toBe(5);
    expect(isHeap(heap.toArray(), "min")).toBe(true);
    expect(await heap.extract()).toBe(1);
    expect(await heap.extract()).toBe(1);
    expect(await heap.extract()).toBe(3);
    expect(heap.size).toBe(2);
  });
});

describe("BinaryHeap hooks (AC-8)", () => {
  it("AC-HEAP-8: onCompare precedes each onSwap on insert; swaps go to parent; stops at root", async () => {
    const heap = await fill([5, 7, 9, 8, 10, 11]);
    const events: string[] = [];
    const swaps: [number, number][] = [];
    await heap.insert(1, {
      onCompare: async (i, j) => {
        events.push(`c${i},${j}`);
      },
      onSwap: async (i, j) => {
        events.push(`s${i},${j}`);
        swaps.push([i, j]);
        expect(j).toBe(BinaryHeap.parent(i));
      },
    });
    // 1 is appended at index 6, swaps with idx 2 then idx 0
    expect(events).toEqual(["c6,2", "s6,2", "c2,0", "s2,0"]);
    expect(swaps).toEqual([
      [6, 2],
      [2, 0],
    ]);
    // never compared past the root
    expect(events.some((e) => e.startsWith("c0,"))).toBe(false);
    expect(heap.peek()).toBe(1);
  });

  it("AC-HEAP-8: insert that does not move compares once and never swaps", async () => {
    const heap = await fill([1, 2, 3]);
    const swap = vi.fn(async () => {});
    const compare = vi.fn(async () => {});
    await heap.insert(10, { onCompare: compare, onSwap: swap });
    expect(compare).toHaveBeenCalledTimes(1);
    expect(swap).not.toHaveBeenCalled();
  });

  it("AC-HEAP-8: insert fires onAdd with the new index first", async () => {
    const heap = await fill([1, 2, 3]);
    const calls: string[] = [];
    await heap.insert(0, {
      onAdd: async (i) => {
        calls.push(`a${i}`);
      },
      onCompare: async () => {
        calls.push("c");
      },
    });
    expect(calls[0]).toBe("a3");
  });

  it("AC-HEAP-8: extract moves the last element to the root then sifts down choosing the smaller child", async () => {
    // [1,3,2,7,4,5,6]: last = 6 moves to root, children 3 and 2 -> swap with the smaller (2)
    const heap = new BinaryHeap("min");
    await heap.buildHeap([1, 3, 2, 7, 4, 5, 6]);
    expect(heap.toArray()).toEqual([1, 3, 2, 7, 4, 5, 6]);
    const order: string[] = [];
    const swaps: [number, number][] = [];
    const root = await heap.extract({
      onSetRoot: async (from) => {
        order.push(`root:${from}`);
        // at this point the last slot is already gone and the root holds the old last value
        expect(heap.size).toBe(6);
        expect(heap.peek()).toBe(6);
      },
      onSwap: async (i, j) => {
        order.push(`swap:${i},${j}`);
        swaps.push([i, j]);
      },
    });
    expect(root).toBe(1);
    expect(order[0]).toBe("root:6");
    expect(swaps[0]).toEqual([0, 2]);
    expect(isHeap(heap.toArray(), "min")).toBe(true);
    assertTreeView(heap);
  });

  it("AC-HEAP-8: max mode extract swaps with the larger child", async () => {
    const heap = new BinaryHeap("max");
    await heap.buildHeap([9, 7, 8, 1, 2, 3, 4]);
    const swaps: [number, number][] = [];
    await heap.extract({
      onSwap: async (i, j) => {
        swaps.push([i, j]);
      },
    });
    // 4 moves to root; children 7 and 8 -> larger (8) at index 2
    expect(swaps[0]).toEqual([0, 2]);
    expect(heap.peek()).toBe(8);
  });

  it("AC-HEAP-8: extract compares siblings before comparing with the parent", async () => {
    const heap = new BinaryHeap("min");
    await heap.buildHeap([1, 3, 2, 7, 4, 5, 6]);
    const compares: [number, number][] = [];
    await heap.extract({
      onCompare: async (i, j) => {
        compares.push([i, j]);
      },
    });
    expect(compares[0]).toEqual([1, 2]);
    expect(compares[1]).toEqual([0, 2]);
  });
});

describe("BinaryHeap helpers (AC-9)", () => {
  it("AC-HEAP-9: parent/left/right index helpers", () => {
    expect(BinaryHeap.parent(4)).toBe(1);
    expect(BinaryHeap.left(1)).toBe(3);
    expect(BinaryHeap.right(1)).toBe(4);
    expect(BinaryHeap.parent(1)).toBe(0);
    expect(BinaryHeap.parent(2)).toBe(0);
    expect(BinaryHeap.left(0)).toBe(1);
    expect(BinaryHeap.right(0)).toBe(2);
  });

  it("AC-HEAP-9: height is floor(log2(size))+1 and 0 when empty", async () => {
    const heap = new BinaryHeap();
    expect(heap.height).toBe(0);
    for (let n = 1; n <= 40; n++) {
      await heap.insert(n);
      expect(heap.height).toBe(Math.floor(Math.log2(n)) + 1);
    }
  });

  it("clear empties the heap and the tree view", async () => {
    const heap = await fill([3, 1, 2]);
    heap.clear();
    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeNull();
    assertTreeView(heap);
    await heap.insert(4);
    expect(heap.toArray()).toEqual([4]);
    assertTreeView(heap);
  });
});
