import {
  createRandomArrayOfNodes,
  createRandomUniqueArrayOfNodes,
} from "@/lib/utils";
import { SortAlgorithms } from "./SortAlgorithms";
import Node from "@/entities/data-structures/linear/_classes/Node";
const testIfIsSorted = (array: Node<number>[], log = false) => {
  for (let i = 0; i < array.length - 1; i++) {
    const left = array[i];
    const right = array[i + 1];
    if (log) console.log(left.data);
    expect(left.data).toBeLessThan(right.data);
  }
};

describe("Testing bubble", () => {
  it("Should return a empty array", async () => {
    const array = await SortAlgorithms.bubble([]);

    expect(array?.length).toBe(0);
  });
  it("Should sort", async () => {
    const array = await SortAlgorithms.bubble(
      createRandomUniqueArrayOfNodes(200, [0, 15000])
    );
    testIfIsSorted(array);
  });
});
describe("Testing selection", () => {
  it("Should return a empty array", async () => {
    const array = await SortAlgorithms.selection([]);

    expect(array?.length).toBe(0);
  });
  it("Should sort", async () => {
    const array = await SortAlgorithms.selection(
      createRandomUniqueArrayOfNodes(10, [0, 15000])
    );
    testIfIsSorted(array);
  });
});
