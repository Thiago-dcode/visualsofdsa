import BinaryTreeNode from "../../../tree/_classes/BinaryTreeNode";
import { BinarySearchTree } from "../BinarySearchTree";

describe("Testing insert method", () => {
  it("should insert when root is null", () => {
    const bts = new BinarySearchTree();
    const data = 234;
    bts.insert(data);
    expect(bts.root).toBeTruthy();
    expect(bts.root?.data).toBe(data);
  });
  it("should insert on the right side", () => {
    const bts = new BinarySearchTree();

    bts.insert(100);
    bts.insert(120);
    let right = bts.root?.right;
    expect(right?.data).toBe(120);
    bts.insert(120);
    right = bts.root?.right?.right;
    expect(right?.data).toBe(undefined);
    bts.insert(140);
    right = bts.root?.right?.right;
    expect(right?.data).toBe(140);
    bts.insert(160);
    right = bts.root?.right?.right?.right;
    expect(right?.data).toBe(160);
    bts.insert(110);
    let left = bts.root?.right?.left;
    expect(left?.data).toBe(110);
    bts.insert(115);
    right = left?.right;
    expect(right?.data).toBe(115);
  });
});

describe("Testing Search method", () => {
  it("Should return null when root is null", async () => {
    const bts = new BinarySearchTree();
    expect(await bts.search(244)).toBeNull();
  });
  it("Should search", async () => {
    const bts = new BinarySearchTree();
    for (let index = 0; index < 1000; index++) {
      bts.insert(index);
    }
    for (let index = 0; index < 1000; index++) {
      const node = await bts.search(index);
      expect(node).toBeInstanceOf(BinaryTreeNode);
      expect(node?.data).toBe(index);
    }
    for (let index = 1000; index < 2000; index++) {
      const node = await bts.search(index);
      expect(node).toBeNull();
    }
  });
});

describe("Testing remove method", () => {
  it("Should remove on case 1 and 2", async () => {
    const bts = new BinarySearchTree();
    await bts.insert(1);
    //case 1 no child
    expect(await bts.remove(1)).toBeTruthy();
    expect(await bts.search(1)).toBeNull();
    //case 2, 1 child
    //left
    await bts.insert(10);
    await bts.insert(5);
    expect(bts.root?.left).toBeTruthy();
    expect(await bts.remove(10)).toBeTruthy();
    expect(bts.root?.data).toBe(5);
    expect(bts.root?.left).toBeFalsy();
    expect(await bts.search(10)).toBeNull();
    bts.clear();
    //left
    await bts.insert(10);
    await bts.insert(20);
    expect(bts.root?.right).toBeTruthy();
    expect(await bts.remove(10)).toBeTruthy();
    expect(bts.root?.data).toBe(20);
    expect(bts.root?.right).toBeFalsy();
    expect(await bts.search(10)).toBeNull();
    bts.clear();
  });
  it("Should remove on case 3", async () => {
    const bts = new BinarySearchTree();

    // Build the tree:
    //         15
    //        /  \
    //      10    20
    //     /  \   /  \
    //    5   12 17   25
    await bts.insert(15);
    await bts.insert(10);
    await bts.insert(20);
    await bts.insert(5);
    await bts.insert(12);
    await bts.insert(17);
    await bts.insert(25);

    // Ensure the tree is correctly built
    expect(bts.root?.data).toBe(15);
    expect(bts.root?.left?.data).toBe(10);
    expect(bts.root?.right?.data).toBe(20);

    // Remove a node with two children (15)
    expect(await bts.remove(15)).toBeTruthy();

    // // Verify that 15 is replaced by its in-order successor (17)
    expect(bts.root?.data).toBe(17);

    // // Verify the in-order successor's original position is now gone
    expect(await bts.search(17)).toBeTruthy();
    expect(bts.root?.right).toBeTruthy();
    expect(bts.root?.right?.left).toBeNull(); // 17's original position is empty

    // // Verify the tree structure remains valid:
    // //         17
    // //        /  \
    // //      10    20
    // //     /  \     \
    // //    5   12     25
    expect(bts.root?.left?.data).toBe(10);
    expect(bts.root?.right?.data).toBe(20);
    expect(bts.root?.left?.left?.data).toBe(5);
    expect(bts.root?.left?.right?.data).toBe(12);
    expect(bts.root?.right?.right?.data).toBe(25);

    // // Attempt to remove the in-order successor again
    expect(await bts.remove(17)).toBeTruthy();
    expect(bts.root?.data).toBe(20);
    expect(bts.root?.left?.data).toBe(10);
    expect(bts.root?.right?.data).toBe(25);
  });
});

describe("Test inOrderTraversal", async () => {
  it("Should traverse", async () => {
    const bts = new BinarySearchTree();

    // Build the tree:
    //         15
    //        /  \
    //      10    20
    //     /  \   /  \
    //    5   12 17   25
    await bts.insert(15);
    await bts.insert(10);
    await bts.insert(20);
    await bts.insert(5);
    await bts.insert(12);
    await bts.insert(17);
    await bts.insert(25);
    let data = 0;
    bts.inOrderTraversal(async (node) => {
      expect(data).toBeLessThan(node.data);
      data = node.data;
    
    });
  });
});
