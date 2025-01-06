import {
  createRandomArrayOfNodes,
  createRandomUniqueArrayOfNodes,
} from "@/lib/utils";
import { SortAlgorithms } from "./SortAlgorithms";
import Node from "@/entities/data-structures/linear/_classes/Node";
import { Direction } from "@/types";
const testIfIsSorted = (
  array: Node<number>[],
  direction: Direction,
  log = false
) => {
  for (let i = 0; i < array.length - 1; i++) {
    const left = array[i];
    const right = array[i + 1];
    if (log) console.log(left.data);
    if (direction === "ascending")
      expect(left.data).toBeLessThanOrEqual(right.data);
    else if (direction === "descending")
      expect(left.data).toBeGreaterThanOrEqual(right.data);
  }
};

describe("Testing bubble", () => {
  it("Should return an empty array", async () => {
    const array:Node<number>[] = [];
     await SortAlgorithms.bubble(array);

    expect(array?.length).toBe(0);
  });

  it("Should sort ascending", async () => {
    const array = createRandomUniqueArrayOfNodes(200, [0, 15000]);
     await SortAlgorithms.bubble(array);

    testIfIsSorted(array, "ascending");
  });

  it("Should sort descending", async () => {
    const array = createRandomUniqueArrayOfNodes(200, [0, 15000]);
     await SortAlgorithms.bubble(array, "descending");

    testIfIsSorted(array, "descending");
  });
});

describe("Testing selection", () => {
  it("Should return an empty array", async () => {
    const array:Node<number>[] = [];
     await SortAlgorithms.selection(array);

    expect(array?.length).toBe(0);
  });

  it("Should sort ascending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.selection(array);

    testIfIsSorted(array, "ascending");
  });

  it("Should sort descending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.selection(array, "descending");

    testIfIsSorted(array, "descending");
  });
});

describe("Testing insertion", () => {
  it("Should return an empty array", async () => {
    const array:Node<number>[] = [];
     await SortAlgorithms.insertion(array);

    expect(array?.length).toBe(0);
  });

  it("Should sort ascending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.insertion(array);

    testIfIsSorted(array, "ascending");
  });

  it("Should sort descending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.insertion(array, "descending");

    testIfIsSorted(array, "descending");
  });
});

describe("Testing merge", () => {
  it("Should return an empty array", async () => {
    const array:Node<number>[] = [];
     await SortAlgorithms.merge(array);

    expect(array?.length).toBe(0);
  });

  it("Should sort ascending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.merge(array);

    testIfIsSorted(array, "ascending");
  });

  it("Should sort descending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.merge(array, "descending");

    testIfIsSorted(array, "descending");
  });
});

describe("Testing quick", () => {
  it("Should return an empty array", async () => {
    const array:Node<number>[] = [];
     await SortAlgorithms.quick(array);

    expect(array?.length).toBe(0);
  });

  it("Should sort ascending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.quick(array);

    testIfIsSorted(array, "ascending");
  });

  it("Should sort descending", async () => {
    const array = createRandomUniqueArrayOfNodes(600, [0, 15000]);
     await SortAlgorithms.quick(array, "descending");

    testIfIsSorted(array, "descending");
  });
});
