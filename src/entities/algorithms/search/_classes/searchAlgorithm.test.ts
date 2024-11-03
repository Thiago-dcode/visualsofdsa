import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "@/lib/classes/Position";
import { random } from "@/lib/utils";
import SearchAlgorithm from "./SearchAlgorithm";

// const createUniqueSortedArrayOfNodes = (size: number) => {
//   const array: Node<number>[] = [];
//   const memo: {
//     [key: number]: true;
//   } = {};
//   for (let index = 0; index < array.length; index++) {
//     array.push(
//       new Node(getAUniqueRandomNumber(memo), new Position(0, 0), null)
//     );
//   }

//   array.sort();
//   return array;
// };
const createArrayOfNodes = (array: number[]) => {
  const arrayNodes: Node<number>[] = [];
  for (let i = 0; i < array.length; i++) {
    arrayNodes.push(new Node(array[i], new Position(0, 0), null));
  }
  return arrayNodes;
};
const createASortedArrayOfNodes = (
  size: number,
  direction: "forward" | "reverse" = "forward",
  add = 0
) => {
  const array: Node<number>[] = [];
  if (direction === "forward") {
    for (let i = 0; i < size; i++) {
      array.push(new Node(i + i * add, new Position(0, 0)));
    }
  } else {
    for (let i = size - 1; i >= 0; i--) {
      array.push(new Node(i + i * add, new Position(0, 0)));
    }
  }
  return array;
};

describe("Test searchAlgorithm.linear", () => {
  it("Should find and a element in a unsorted array", async () => {
    const array = createArrayOfNodes([
      345, 3, 22344, 78, 4, 5, 23, 53, 123, 435, 3452, 3999, 5344, 0, 14, 5553,
      9999, 144345, 235325, 235235235, 23523624626, 25342351325215,
      34263469879898,
    ]);

    const node = await SearchAlgorithm.linear(
      array,
      3999,
      async (node, index) => {
        expect(node).toBe(array[index]);
      }
    );

    expect(node instanceof Node && node.data === 3999).toBe(true);
  });
  it("Should traverse an array when is unsorted and element not found", async () => {
    const array = createArrayOfNodes([
      345, 3, 22344, 78, 4, 5, 23, 53, 123, 435, 3452, 3999, 5344, 0, 14, 5553,
      9999, 144345, 235325, 5235235, 2326, 25342351325215, 34264699898, 666,
      555, 222, 1145,
    ]);
    let j = 0;

    const node = await SearchAlgorithm.linear(array, 9, async (node, index) => {
      expect(node).toBe(array[index]);
      j++;
    });
    expect(j).toBe(array.length);
    expect(node).toBe(null);
  });
  it("Should find and a element in a sorted forward array", async () => {
    const array = createASortedArrayOfNodes(200);
    const node = await SearchAlgorithm.linear(
      array,
      100,
      async (node, index) => {
        expect(node).toBe(array[index]);
      }
    );
    expect(node instanceof Node && node.data === 100).toBe(true);
  });
  it("Should take one step when element is the last of the array ", async () => {
    const array = createASortedArrayOfNodes(200, "forward", 0);
    let j = 0;
    const node = await SearchAlgorithm.linear(
      array,
      199,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true,
      "forward"
    );
    expect(j).toBe(1);
    expect(node?.data).toBe(199);
  });
  it("Should take one step when element is the last of the array", async () => {
    const array = createASortedArrayOfNodes(200, "reverse", 0);
    let j = 0;
    const node = await SearchAlgorithm.linear(
      array,
      0,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true,
      "reverse"
    );
    expect(j).toBe(1);
    expect(node?.data).toBe(0);
  });
  it("Should not traverse a forward sorted array when element not found", async () => {
    const array = createASortedArrayOfNodes(200, "forward", 1);
    let j = 0;
    const node = await SearchAlgorithm.linear(
      array,
      101,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true
    );
    expect(j).toBeGreaterThan(20);
    expect(j).toBeLessThan(array.length);
    expect(node).toBe(null);
  });
  it("Should not traverse a reverse sorted array when element not found", async () => {
    const array = createASortedArrayOfNodes(200, "reverse", 1);
    let j = 0;
    const node = await SearchAlgorithm.linear(
      array,
      101,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true,
      "reverse"
    );
    expect(j).toBeGreaterThan(20);
    expect(j).toBeLessThan(array.length);
    expect(node).toBe(null);
  });
  it("Should take only one step when the search element is greater than the last element of a sorted forward array", async () => {
    const array = createASortedArrayOfNodes(200, "forward", 1);
    let j = 0;
    const node = await SearchAlgorithm.linear(
      array,
      400,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true,
      "forward"
    );
    
    expect(j).toBe(0);
    expect(node).toBe(null);
  });
  it("Should take only one step when the search element is less than the last element of a sorted reverse array", async () => {
    const array = createASortedArrayOfNodes(200, "reverse", 1);
    let j = 0;
    
    const node = await SearchAlgorithm.linear(
      array,
      -1,
      async (node, index) => {
        expect(node).toBe(array[index]);
        j++;
      },
      true,
      "reverse"
    );
    expect(j).toBe(0);
    expect(node).toBe(null);
  });
});
