import { Result } from "postcss";
import BinaryTreeNode from "../../../tree/_classes/BinaryTreeNode";
import { TreeObj } from "../../../tree/types";
import { BinarySearchTree } from "../BinarySearchTree";

const buildATree = async (arr: number[], bst: BinarySearchTree<number>) => {
  await Promise.all(arr.map(async (n) => bst.insert(n)));
  await bst.insert(15);
  await bst.insert(10);
  await bst.insert(20);
  await bst.insert(5);
  await bst.insert(12);
  await bst.insert(17);
  await bst.insert(25);
};
type TreeObjMock = {
  node: number;
  depth: number;
  children: TreeObjMock[];
};
function generateExpectedTreeObj(
  node: BinaryTreeNode<number>,
  depth: number = 0
): TreeObjMock {
  const children: TreeObjMock[] = [];
  if (node.left) {
    children.push(generateExpectedTreeObj(node.left, depth - 1));
  }
  if (node.right) {
    children.push(generateExpectedTreeObj(node.right, depth - 1));
  }
  return {
    node: node.data,
    depth,
    children,
  };
}
describe("Testing insert method", () => {
  it("should insert when root is null", () => {
    const bst = new BinarySearchTree();
    const data = 234;
    bst.insert(data);
    expect(bst.root).toBeTruthy();
    expect(bst.root?.data).toBe(data);
  });
  it("should insert on the right side", () => {
    const bst = new BinarySearchTree();

    bst.insert(100);
    bst.insert(120);
    let right = bst.root?.right;
    expect(right?.data).toBe(120);
    bst.insert(120);
    right = bst.root?.right?.right;
    expect(right?.data).toBe(undefined);
    bst.insert(140);
    right = bst.root?.right?.right;
    expect(right?.data).toBe(140);
    bst.insert(160);
    right = bst.root?.right?.right?.right;
    expect(right?.data).toBe(160);
    bst.insert(110);
    let left = bst.root?.right?.left;
    expect(left?.data).toBe(110);
    bst.insert(115);
    right = left?.right;
    expect(right?.data).toBe(115);
  });
});

describe("Testing Search method", () => {
  it("Should return null when root is null", async () => {
    const bst = new BinarySearchTree();
    expect(await bst.search(244)).toBeNull();
  });
  it("Should search", async () => {
    const bst = new BinarySearchTree();
    const arr = [
      100, 50, 200, 35, 75, 300, 150, 25, 90, 400, 125, 40, 65, 175, 250, 20,
      500, 12, 434, 35, 343, 1, 53, 663, 3, -1, 23, 4, 55, 3424, 53, 35, 6, 78,
      356, 230, 89, -23,
    ];
    await buildATree(arr, bst);

    for (let index = 0; index < arr.length; index++) {
      const node = await bst.search(arr[index]);
      expect(node).toBeInstanceOf(BinaryTreeNode);
      expect(node?.data).toBe(arr[index]);
    }
    for (let index = 1000; index < 2000; index++) {
      const node = await bst.search(index);
      expect(node).toBeNull();
    }
  });
});

describe("Testing remove method", () => {
  it("Should remove on case 1 and 2", async () => {
    const bst = new BinarySearchTree();
    await bst.insert(1);
    //case 1 no child
    expect(await bst.remove(1)).toBeTruthy();
    expect(await bst.search(1)).toBeNull();
    //case 2, 1 child
    //left
    await bst.insert(10);
    await bst.insert(5);
    expect(bst.root?.left).toBeTruthy();
    expect(await bst.remove(10)).toBeTruthy();
    expect(bst.root?.data).toBe(5);
    expect(bst.root?.left).toBeFalsy();
    expect(await bst.search(10)).toBeNull();
    bst.clear();
    //left
    await bst.insert(10);
    await bst.insert(20);
    expect(bst.root?.right).toBeTruthy();
    expect(await bst.remove(10)).toBeTruthy();
    expect(bst.root?.data).toBe(20);
    expect(bst.root?.right).toBeFalsy();
    expect(await bst.search(10)).toBeNull();
    bst.clear();
  });
  it("Should remove on case 3", async () => {
    const bst = new BinarySearchTree();

    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Ensure the tree is correctly built
    expect(bst.root?.data).toBe(15);
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(20);

    // Remove a node with two children (15)
    expect(await bst.remove(15)).toBeTruthy();

    // // Verify that 15 is replaced by its in-order successor (17)
    expect(bst.root?.data).toBe(17);

    // // Verify the in-order successor's original position is now gone
    expect(await bst.search(17)).toBeTruthy();
    expect(bst.root?.right).toBeTruthy();
    expect(bst.root?.right?.left).toBeNull(); // 17's original position is empty

    // // Verify the tree structure remains valid:
    // //         17
    // //        /  \
    // //      10    20
    // //     /  \     \
    // //    5   12     25
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(20);
    expect(bst.root?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.right?.data).toBe(12);
    expect(bst.root?.right?.right?.data).toBe(25);

    // // Attempt to remove the in-order successor again
    expect(await bst.remove(17)).toBeTruthy();
    expect(bst.root?.data).toBe(20);
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(25);
  });
});

describe("Test inOrderTraversal", async () => {
  it("Should traverse", async () => {
    const bst = new BinarySearchTree();

    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);
    let data = 0;
    bst.inOrderTraversal(null,async (node) => {
      expect(data).toBeLessThan(node.data);
      data = node.data;
    });
  });
});

describe("Testing levelInOrderTraversal", () => {
  it("Should traverse", async () => {
    const bst = new BinarySearchTree();

    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);
    const result = await bst.levelOrderTraversal();

    const expected = [[15], [10, 20], [5, 12, 17, 25]];

    expect(result.length).toEqual(expected.length);

    for (const i in result) {
      for (const j in result[i]) {
        expect(result[i][j].data).toEqual(expected[i][j]);
      }
    }
  });
});

describe("Testing toTreeObj", () => {
  it("Should return a TreeObj", async () => {
    const bst = new BinarySearchTree();
    const nodes = [
      100, 50, 200, 35, 75, 300, 150, 25, 90, 400, 125, 40, 65, 175, 250, 20,
      500, 12, 434, 35, 343, 1, 53, 663, 3, -1, 23, 4, 55, 3424, 53, 35, 6, 78,
      356, 230, 89, -23,
    ];
    await buildATree(nodes, bst);

    const result = bst.toTreeObj();
    expect(result).toBeTruthy();
    if (!result) return;

    // Generate the expected tree object dynamically
    const _expected = generateExpectedTreeObj(bst.root!);

    // Test the tree object
    const testTreeObj = (treeObj: TreeObj, expected: typeof _expected) => {
      expect(treeObj.node.data).toEqual(expected.node);
      expect(treeObj.depth).toEqual(expected.depth);
      expect(treeObj.children.length).toEqual(expected.children.length);
      for (let i = 0; i < expected.children.length; i++) {
        testTreeObj(treeObj.children[i], expected.children[i]);
      }
    };

    testTreeObj(result, _expected);
  });
});
