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
  it("Should return a empty array", async () => {
    const array = await SortAlgorithms.bubble([]);

    expect(array?.length).toBe(0);
  });
  it("Should sort ascending", async () => {
    const array = await SortAlgorithms.bubble(
      createRandomUniqueArrayOfNodes(200, [0, 15000])
    );
    testIfIsSorted(array, "ascending");
  });
  it("Should sort descending", async () => {
    const array = await SortAlgorithms.bubble(
      createRandomUniqueArrayOfNodes(200, [0, 15000]),"descending"
    );
    testIfIsSorted(array, "descending");
  });
});
describe("Testing selection", () => {
  it("Should return a empty array", async () => {
    const array = await SortAlgorithms.selection([]);

    expect(array?.length).toBe(0);
  });
  it("Should sort ascending", async () => {
    const array = await SortAlgorithms.selection(
      createRandomUniqueArrayOfNodes(600, [0, 15000])
    );
    testIfIsSorted(array, "ascending");
  });
  it("Should sort descending", async () => {
    const array = await SortAlgorithms.selection(
      createRandomUniqueArrayOfNodes(600, [0, 15000]),'descending'
    );
    testIfIsSorted(array, "descending");
  });
});
