import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/position/Position";
import MaxStepsError from "@/lib/errors/MaxStepsError";
import { radixSort } from "./radixSort";

const build = (values: number[]) =>
  values.map((v, i) => {
    const ref = document.createElement("div");
    ref.dataset.order = String(i);
    return new Node(v, new Position(0, 0), ref);
  });
const values = (array: Node<number>[]) => array.map((n) => n.data);
const order = (array: Node<number>[]) => array.map((n) => Number(n.ref?.dataset.order));

describe("radixSort", () => {
  it("AC-RDX-1: sorts ascending", async () => {
    const array = build([170, 45, 75, 90, 802, 24, 2, 66]);
    await radixSort(array);
    expect(values(array)).toEqual([2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it("AC-RDX-1: sorts descending", async () => {
    const array = build([170, 45, 75, 90, 802, 24, 2, 66]);
    await radixSort(array, "descending");
    expect(values(array)).toEqual([802, 170, 90, 75, 66, 45, 24, 2]);
  });

  it("AC-RDX-2: mixed digit lengths and zeros", async () => {
    const array = build([0, 10, 100, 1]);
    await radixSort(array);
    expect(values(array)).toEqual([0, 1, 10, 100]);
  });

  it("AC-RDX-2: all zeros", async () => {
    const array = build([0, 0, 0]);
    await radixSort(array);
    expect(values(array)).toEqual([0, 0, 0]);
  });

  it("AC-RDX-2: empty and single element are unchanged", async () => {
    const empty: Node<number>[] = [];
    await expect(radixSort(empty)).resolves.toBeDefined();
    expect(empty).toHaveLength(0);
    const one = build([42]);
    expect(await radixSort(one)).toBe(1);
    expect(values(one)).toEqual([42]);
  });

  it("AC-RDX-3: stable for equal values", async () => {
    const array = build([20, 5, 20, 5, 13, 20]);
    await radixSort(array);
    expect(values(array)).toEqual([5, 5, 13, 20, 20, 20]);
    expect(order(array)).toEqual([1, 3, 4, 0, 2, 5]);
  });

  it("AC-RDX-3: stable for equal values descending", async () => {
    const array = build([20, 5, 20, 5, 13, 20]);
    await radixSort(array, "descending");
    expect(values(array)).toEqual([20, 20, 20, 13, 5, 5]);
    expect(order(array)).toEqual([0, 2, 5, 4, 1, 3]);
  });

  it("AC-RDX-4: negative input rejects with RangeError and leaves the array untouched", async () => {
    const array = build([5, -1, 3]);
    const before = array.map((n) => n);
    await expect(radixSort(array)).rejects.toBeInstanceOf(RangeError);
    await expect(radixSort(array)).rejects.toThrow("Radix sort supports non-negative integers");
    expect(array).toEqual(before);
    expect(values(array)).toEqual([5, -1, 3]);
  });

  it("AC-RDX-4: non-integer input rejects with RangeError and leaves the array untouched", async () => {
    const array = build([5, 2.5, 3]);
    const snapshot = [...array];
    await expect(radixSort(array)).rejects.toBeInstanceOf(RangeError);
    array.forEach((n, i) => {
      expect(n).toBe(snapshot[i]);
    });
  });

  it("AC-RDX-5: onPass once per digit, onDistribute/onCollect per element per pass", async () => {
    const array = build([170, 45, 75, 90, 802, 24, 2, 66]);
    const passes: [number, number][] = [];
    let distributes = 0;
    let collects = 0;
    await radixSort(
      array,
      "ascending",
      async (d, total) => {
        passes.push([d, total]);
      },
      async (_n, digit) => {
        distributes++;
        expect(digit).toBeGreaterThanOrEqual(0);
        expect(digit).toBeLessThanOrEqual(9);
      },
      async () => {
        collects++;
      },
    );
    expect(passes).toEqual([
      [0, 3],
      [1, 3],
      [2, 3],
    ]);
    expect(distributes).toBe(3 * 8);
    expect(collects).toBe(3 * 8);
  });

  it("AC-RDX-5: collect follows bucket order 0..9 (ascending) and 9..0 (descending)", async () => {
    const input = [31, 12, 23, 40];
    const asc = build(input);
    const ascDigits: number[] = [];
    const ascSource: number[] = [];
    // First pass only: units digits are 1,2,3,0
    await radixSort(
      asc,
      "ascending",
      undefined,
      async (n, digit) => {
        if (ascDigits.length < input.length) ascDigits.push(digit);
        void n;
      },
      async (_slot, source, target) => {
        if (ascSource.length < input.length) {
          ascSource.push(source.data);
          expect(target).toBe(ascSource.length - 1);
        }
      },
    );
    expect(ascDigits).toEqual([1, 2, 3, 0]);
    expect(ascSource).toEqual([40, 31, 12, 23]);

    const desc = build(input);
    const descSource: number[] = [];
    await radixSort(desc, "descending", undefined, undefined, async (_slot, source) => {
      if (descSource.length < input.length) descSource.push(source.data);
    });
    expect(descSource).toEqual([23, 12, 31, 40]);
  });

  it("AC-RDX-6: step count is passes * n * 2", async () => {
    const array = build([170, 45, 75, 90, 802, 24, 2, 66]);
    expect(await radixSort(array)).toBe(3 * 8 * 2);
  });

  it("AC-RDX-6: throws MaxStepsError past 70000 steps", async () => {
    // 7 digits * 6000 elements * 2 = 84000 > 70000
    const array = build(Array.from({ length: 6000 }, (_, i) => 1_000_000 + i));
    await expect(radixSort(array)).rejects.toBeInstanceOf(MaxStepsError);
  });
});
