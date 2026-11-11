import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/position/Position";
import MaxStepsError from "@/lib/errors/MaxStepsError";
import { countingSort } from "./countingSort";

/** Every node carries a distinct ref marker so stability can be checked (clone(true) keeps refs). */
const build = (values: number[]) =>
  values.map((v, i) => {
    const ref = document.createElement("div");
    ref.dataset.order = String(i);
    return new Node(v, new Position(0, 0), ref);
  });
const values = (array: Node<number>[]) => array.map((n) => n.data);
const order = (array: Node<number>[]) => array.map((n) => Number(n.ref?.dataset.order));

describe("countingSort", () => {
  it("AC-CNT-1: sorts ascending", async () => {
    const array = build([4, 2, 2, 8, 3, 3, 1]);
    await countingSort(array);
    expect(values(array)).toEqual([1, 2, 2, 3, 3, 4, 8]);
  });

  it("AC-CNT-1: sorts descending", async () => {
    const array = build([4, 2, 2, 8, 3, 3, 1]);
    await countingSort(array, "descending");
    expect(values(array)).toEqual([8, 4, 3, 3, 2, 2, 1]);
  });

  it("AC-CNT-2: empty array stays empty and does not throw", async () => {
    const array: Node<number>[] = [];
    await expect(countingSort(array)).resolves.toBeDefined();
    expect(array).toHaveLength(0);
  });

  it("AC-CNT-2: single element stays unchanged and returns 1", async () => {
    const array = build([7]);
    const steps = await countingSort(array);
    expect(steps).toBe(1);
    expect(values(array)).toEqual([7]);
  });

  it("AC-CNT-3: handles negative values", async () => {
    const array = build([-3, 5, 0, -3, 2]);
    await countingSort(array);
    expect(values(array)).toEqual([-3, -3, 0, 2, 5]);
    const desc = build([-3, 5, 0, -3, 2]);
    await countingSort(desc, "descending");
    expect(values(desc)).toEqual([5, 2, 0, -3, -3]);
  });

  it("AC-CNT-4: is stable ascending (equal values keep original order)", async () => {
    const array = build([3, 1, 3, 2, 1, 3, 2]);
    await countingSort(array);
    expect(values(array)).toEqual([1, 1, 2, 2, 3, 3, 3]);
    // original indices: 1s at 1,4 ; 2s at 3,6 ; 3s at 0,2,5
    expect(order(array)).toEqual([1, 4, 3, 6, 0, 2, 5]);
  });

  it("AC-CNT-4: is stable descending", async () => {
    const array = build([3, 1, 3, 2, 1, 3, 2]);
    await countingSort(array, "descending");
    expect(values(array)).toEqual([3, 3, 3, 2, 2, 1, 1]);
    expect(order(array)).toEqual([0, 2, 5, 3, 6, 1, 4]);
  });

  it("AC-CNT-5: keeps the same multiset and every slot carries data and ref of an original", async () => {
    const input = [9, 1, 9, 4, 4, 0, 7];
    const array = build(input);
    const originalRefs = new Set(array.map((n) => n.ref));
    await countingSort(array);
    expect([...values(array)].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
    expect(array).toHaveLength(input.length);
    for (const node of array) {
      expect(originalRefs.has(node.ref)).toBe(true);
      expect(input[Number(node.ref?.dataset.order)]).toBe(node.data);
    }
    // every original ref is used exactly once
    expect(new Set(array.map((n) => n.ref)).size).toBe(input.length);
  });

  it("AC-CNT-6: callback order on [2,1,2]", async () => {
    const array = build([2, 1, 2]);
    const events: string[] = [];
    const counts: [number, number][] = [];
    const prefix: number[] = [];
    const places: number[] = [];
    await countingSort(
      array,
      "ascending",
      async (node, idx, c) => {
        events.push("count");
        counts.push([node.data, c]);
        expect(idx).toBe(node.data - 1);
      },
      async (idx, total) => {
        events.push("prefix");
        prefix.push(idx);
        expect(total).toBeGreaterThan(0);
      },
      async (_slot, _src, target) => {
        events.push("place");
        places.push(target);
      },
    );
    expect(counts).toEqual([
      [2, 1],
      [1, 1],
      [2, 2],
    ]);
    expect(prefix).toEqual([0, 1]);
    expect(places).toEqual([2, 0, 1]);
    expect(events).toEqual([
      "count",
      "count",
      "count",
      "prefix",
      "prefix",
      "place",
      "place",
      "place",
    ]);
  });

  it("AC-CNT-6: callbacks are awaited sequentially", async () => {
    const array = build([2, 1, 2]);
    let inFlight = 0;
    let maxInFlight = 0;
    const slow = async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 1));
      inFlight--;
    };
    await countingSort(array, "ascending", slow, slow, slow);
    expect(maxInFlight).toBe(1);
    expect(inFlight).toBe(0);
  });

  it("AC-CNT-7: a value range beyond the guard rejects with MaxStepsError", async () => {
    const array = build([0, 1_000_000]);
    await expect(countingSort(array)).rejects.toBeInstanceOf(MaxStepsError);
  });

  it("AC-CNT-8: step count is count + prefix + place steps", async () => {
    const array = build([4, 2, 2, 8, 3, 3, 1]);
    const steps = await countingSort(array);
    // n counts + range (8-1+1) prefix + n places
    expect(steps).toBe(7 + 8 + 7);
    expect(steps).toBeGreaterThan(0);
    let c = 0;
    let p = 0;
    let pl = 0;
    const again = build([4, 2, 2, 8, 3, 3, 1]);
    const total = await countingSort(
      again,
      "ascending",
      async () => {
        c++;
      },
      async () => {
        p++;
      },
      async () => {
        pl++;
      },
    );
    expect(total).toBe(c + p + pl);
  });

  it("AC-CNT-8: two element array reports more than 0 steps", async () => {
    const array = build([2, 1]);
    expect(await countingSort(array)).toBeGreaterThan(0);
  });
});
