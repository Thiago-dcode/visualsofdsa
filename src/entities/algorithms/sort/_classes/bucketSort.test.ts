import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/position/Position";
import { bucketSort } from "./bucketSort";

const build = (values: number[]) =>
  values.map((v, i) => {
    const ref = document.createElement("div");
    ref.dataset.order = String(i);
    return new Node(v, new Position(0, 0), ref);
  });
const values = (array: Node<number>[]) => array.map((n) => n.data);
const order = (array: Node<number>[]) => array.map((n) => Number(n.ref?.dataset.order));
const asc = (a: number, b: number) => a - b;
const desc = (a: number, b: number) => b - a;

describe("bucketSort", () => {
  it("AC-BKT-1: sorts decimals ascending and descending", async () => {
    const input = [0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51];
    const a = build(input);
    await bucketSort(a);
    expect(values(a)).toEqual([...input].sort(asc));
    const d = build(input);
    await bucketSort(d, "descending");
    expect(values(d)).toEqual([...input].sort(desc));
  });

  it("AC-BKT-1: 200 random integers match Array.prototype.sort in both directions", async () => {
    const input = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
    const a = build(input);
    await bucketSort(a);
    expect(values(a)).toEqual([...input].sort(asc));
    const d = build(input);
    await bucketSort(d, "descending");
    expect(values(d)).toEqual([...input].sort(desc));
  });

  it("AC-BKT-2: empty, single and all-equal arrays", async () => {
    const empty: Node<number>[] = [];
    await expect(bucketSort(empty)).resolves.toBeDefined();
    expect(empty).toHaveLength(0);

    const one = build([3]);
    expect(await bucketSort(one)).toBe(1);
    expect(values(one)).toEqual([3]);

    const same = build([5, 5, 5]);
    await bucketSort(same);
    expect(values(same)).toEqual([5, 5, 5]);
    const sameDesc = build([5, 5, 5]);
    await bucketSort(sameDesc, "descending");
    expect(values(sameDesc)).toEqual([5, 5, 5]);
  });

  it("AC-BKT-3: negatives and mixed signs", async () => {
    const input = [-5, 3, -1, 0, 8, -20, 2.5, -0.5];
    const a = build(input);
    await bucketSort(a);
    expect(values(a)).toEqual([...input].sort(asc));
    const d = build(input);
    await bucketSort(d, "descending");
    expect(values(d)).toEqual([...input].sort(desc));
  });

  it("AC-BKT-4: stable for equal values", async () => {
    const array = build([4, 1, 4, 1, 3, 4, 1]);
    await bucketSort(array);
    expect(values(array)).toEqual([1, 1, 1, 3, 4, 4, 4]);
    expect(order(array)).toEqual([1, 3, 6, 4, 0, 2, 5]);
  });

  it("AC-BKT-4: stable for equal values descending", async () => {
    const array = build([4, 1, 4, 1, 3, 4, 1]);
    await bucketSort(array, "descending");
    expect(values(array)).toEqual([4, 4, 4, 3, 1, 1, 1]);
    expect(order(array)).toEqual([0, 2, 5, 4, 1, 3, 6]);
  });

  it("AC-BKT-5: scatter, bucket sort and gather callbacks", async () => {
    const input = Array.from({ length: 20 }, (_, i) => (i * 37) % 101);
    const array = build(input);
    const scattered: number[] = [];
    const counts = new Set<number>();
    const sortedBuckets: { index: number; data: number[] }[] = [];
    const gathered: number[] = [];
    await bucketSort(
      array,
      "ascending",
      async (node, index, bucketCount) => {
        counts.add(bucketCount);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThanOrEqual(bucketCount - 1);
        scattered.push(node.data);
      },
      async (index, nodes) => {
        sortedBuckets.push({ index, data: nodes.map((n) => n.data) });
      },
      async (_slot, _src, target) => {
        gathered.push(target);
      },
    );
    expect([...counts]).toEqual([Math.ceil(Math.sqrt(20))]);
    expect(scattered).toHaveLength(20);
    expect([...scattered].sort(asc)).toEqual([...input].sort(asc));
    // once per non empty bucket, each sorted
    const idx = sortedBuckets.map((b) => b.index);
    expect(new Set(idx).size).toBe(idx.length);
    for (const b of sortedBuckets) {
      expect(b.data.length).toBeGreaterThan(0);
      expect(b.data).toEqual([...b.data].sort(asc));
    }
    expect(sortedBuckets.reduce((s, b) => s + b.data.length, 0)).toBe(20);
    expect(gathered).toEqual(Array.from({ length: 20 }, (_, i) => i));
  });

  it("AC-BKT-6: skewed input still sorts", async () => {
    const array = build([1, 2, 3, 4, 1000]);
    await bucketSort(array);
    expect(values(array)).toEqual([1, 2, 3, 4, 1000]);
    const d = build([1000, 4, 3, 2, 1]);
    await bucketSort(d, "descending");
    expect(values(d)).toEqual([1000, 4, 3, 2, 1]);
  });

  it("AC-BKT-6: all but one element in a single bucket", async () => {
    const input = [1000, 1, 3, 2, 4, 2, 3, 1, 4];
    const array = build(input);
    await bucketSort(array);
    expect(values(array)).toEqual([...input].sort(asc));
  });
});
