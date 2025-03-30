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
  parent:TreeObjMock|null;
  children: TreeObjMock[];
};
function generateExpectedTreeObj(
  node: BinaryTreeNode<number>,
  parent: TreeObjMock|null,
  depth: number = 0,
  onCall?: (depth: number) => void
): TreeObjMock {
  const children: TreeObjMock[] = [];
  const treeObjMock = {
    node: node.data,
    depth,
    parent,
    children,
  };
  if (onCall) onCall(depth);
  if (node.left) {
    children.push(generateExpectedTreeObj(node.left, treeObjMock,depth + 1, onCall));
  }
  if (node.right) {
    children.push(generateExpectedTreeObj(node.right,treeObjMock, depth + 1, onCall));
  }
  return treeObjMock
}
describe("Testing insert method", () => {
  it("should insert when root is null", () => {
    const bst = new BinarySearchTree();
    const data = 234;
    bst.insert(data);
    expect(bst.root).toBeTruthy();
    expect(bst.root?.data).toBe(data);
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.parent).toBeNull();
  });

  it("should maintain BST properties during insertion", async () => {
    const bst = new BinarySearchTree();
    const values = [50, 30, 70, 20, 40, 60, 80];

    // Insert values and verify BST property at each step
    for (const value of values) {
      await bst.insert(value);
      
      // Verify BST property (left < node < right)
      const verifyBSTProperty = (node: BinaryTreeNode<number> | null): boolean => {
        if (!node) return true;
        
        if (node.left && node.left.data >= node.data) return false;
        if (node.right && node.right.data <= node.data) return false;
        
        return verifyBSTProperty(node.left) && verifyBSTProperty(node.right);
      };
      
      expect(verifyBSTProperty(bst.root)).toBe(true);
    }
  });

  it("should maintain correct parent-child relationships during insertion", async () => {
    const bst = new BinarySearchTree();
    
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    
    // Check root relationships
    expect(bst.root?.data).toBe(50);
    expect(bst.root?.parent).toBeNull();
    expect(bst.root?.isRoot).toBe(true);
    
    // Check left child relationships
    expect(bst.root?.left?.data).toBe(30);
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.left?.isRoot).toBe(false);
    
    // Check right child relationships
    expect(bst.root?.right?.data).toBe(70);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.right?.isRoot).toBe(false);
  });

  it("should handle duplicate values correctly", async () => {
    const bst = new BinarySearchTree();
    
    // Insert original value
    await bst.insert(50);
    expect(bst.root?.data).toBe(50);
    
    // Try inserting duplicate
    const duplicateNode = await bst.insert(50);
    expect(duplicateNode).toBeNull();
    
    // Verify tree structure remains unchanged
    expect(bst.root?.data).toBe(50);
    expect(bst.root?.left).toBeNull();
    expect(bst.root?.right).toBeNull();
    
    // Insert more values and try duplicates
    await bst.insert(30);
    await bst.insert(70);
    expect(await bst.insert(30)).toBeNull();
    expect(await bst.insert(70)).toBeNull();
    
    // Verify structure remains correct
    expect(bst.root?.left?.data).toBe(30);
    expect(bst.root?.right?.data).toBe(70);
  });

  it("should handle left-heavy insertions correctly", async () => {
    const bst = new BinarySearchTree();
    const values = [50, 40, 30, 20, 10];
    
    for (const value of values) {
      await bst.insert(value);
    }
    
    // Verify structure
    expect(bst.root?.data).toBe(50);
    expect(bst.root?.left?.data).toBe(40);
    expect(bst.root?.left?.left?.data).toBe(30);
    expect(bst.root?.left?.left?.left?.data).toBe(20);
    expect(bst.root?.left?.left?.left?.left?.data).toBe(10);
    
    // Verify parent relationships
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.left?.left?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.left?.left?.parent).toBe(bst.root?.left?.left);
  });

  it("should handle right-heavy insertions correctly", async () => {
    const bst = new BinarySearchTree();
    const values = [10, 20, 30, 40, 50];
    
    for (const value of values) {
      await bst.insert(value);
    }
    
    // Verify structure
    expect(bst.root?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(20);
    expect(bst.root?.right?.right?.data).toBe(30);
    expect(bst.root?.right?.right?.right?.data).toBe(40);
    expect(bst.root?.right?.right?.right?.right?.data).toBe(50);
    
    // Verify parent relationships
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.right?.right?.parent).toBe(bst.root?.right);
    expect(bst.root?.right?.right?.right?.parent).toBe(bst.root?.right?.right);
  });

  it("should handle alternating insertions correctly", async () => {
    const bst = new BinarySearchTree();
    const values = [50, 25, 75, 12, 37, 62, 87];
    
    for (const value of values) {
      await bst.insert(value);
    }
    
    // Verify complete tree structure
    expect(bst.root?.data).toBe(50);
    expect(bst.root?.left?.data).toBe(25);
    expect(bst.root?.right?.data).toBe(75);
    expect(bst.root?.left?.left?.data).toBe(12);
    expect(bst.root?.left?.right?.data).toBe(37);
    expect(bst.root?.right?.left?.data).toBe(62);
    expect(bst.root?.right?.right?.data).toBe(87);
    
    // Verify all parent relationships
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.left?.left?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.right?.parent).toBe(bst.root?.left);
    expect(bst.root?.right?.left?.parent).toBe(bst.root?.right);
    expect(bst.root?.right?.right?.parent).toBe(bst.root?.right);
  });

  it("should handle negative numbers correctly", async () => {
    const bst = new BinarySearchTree();
    const values = [0, -10, 10, -20, -5, 5, 20];
    
    for (const value of values) {
      await bst.insert(value);
    }
    
    // Verify structure with negative numbers
    expect(bst.root?.data).toBe(0);
    expect(bst.root?.left?.data).toBe(-10);
    expect(bst.root?.right?.data).toBe(10);
    expect(bst.root?.left?.left?.data).toBe(-20);
    expect(bst.root?.left?.right?.data).toBe(-5);
    expect(bst.root?.right?.left?.data).toBe(5);
    expect(bst.root?.right?.right?.data).toBe(20);
  });

  it("should maintain correct sibling relationships during insertion", async () => {
    const bst = new BinarySearchTree();
    await bst.insert(50);
    await bst.insert(25);
    await bst.insert(75);
    
    // Test sibling relationships at root level
    expect(bst.root?.left?.nextSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.previousSibling).toBe(bst.root?.left);
    
    // Add more nodes and test deeper sibling relationships
    await bst.insert(12);
    await bst.insert(37);
    
    expect(bst.root?.left?.left?.nextSibling).toBe(bst.root?.left?.right);
    expect(bst.root?.left?.right?.previousSibling).toBe(bst.root?.left?.left);
  });

  it("should handle edge case values correctly", async () => {
    const bst = new BinarySearchTree();
    
    // Test with Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
    await bst.insert(0);
    await bst.insert(Number.MAX_SAFE_INTEGER);
    await bst.insert(Number.MIN_SAFE_INTEGER);
    
    expect(bst.root?.data).toBe(0);
    expect(bst.root?.right?.data).toBe(Number.MAX_SAFE_INTEGER);
    expect(bst.root?.left?.data).toBe(Number.MIN_SAFE_INTEGER);
    
    // Test with decimal numbers
    await bst.insert(0.5);
    await bst.insert(-0.5);
    
    expect(bst.root?.right?.left?.data).toBe(0.5);
    expect(bst.root?.left?.right?.data).toBe(-0.5);
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
  it("Should handle all remove scenarios correctly", async () => {
    const bst = new BinarySearchTree();
    
    // Test Case 1: Remove from empty tree
    expect(await bst.remove(1)).toBeFalsy();
    expect(bst.root).toBeNull();

    // Test Case 2: Remove root with no children
    await bst.insert(1);
    expect(bst.root?.isRoot).toBe(true);
    expect(await bst.remove(1)).toBeTruthy();
    expect(bst.root).toBeNull();

    // Test Case 3: Remove root with one child (left)
    await bst.insert(10);
    await bst.insert(5);
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(10);
    expect(bst.root?.left?.data).toBe(5);
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(await bst.remove(10)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(5);
    expect(bst.root?.left).toBeNull();
    expect(bst.root?.right).toBeNull();
    expect(bst.root?.parent).toBeNull();

    // Test Case 4: Remove root with one child (right)
    bst.clear();
    await bst.insert(10);
    await bst.insert(15);
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(15);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(await bst.remove(10)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(15);
    expect(bst.root?.left).toBeNull();
    expect(bst.root?.right).toBeNull();
    expect(bst.root?.parent).toBeNull();

    // Test Case 5: Remove root with two children
    bst.clear();
    /*
          15
         /  \
        10   20
       / \   / \
      5  12 17  25
    */
    await bst.insert(15);
    await bst.insert(10);
    await bst.insert(20);
    await bst.insert(5);
    await bst.insert(12);
    await bst.insert(17);
    await bst.insert(25);
    
    // Verify initial tree structure and relationships
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(15);
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(20);
    expect(bst.root?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.right?.data).toBe(12);
    expect(bst.root?.right?.left?.data).toBe(17);
    expect(bst.root?.right?.right?.data).toBe(25);
    
    // Verify parent-child relationships
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.left?.left?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.right?.parent).toBe(bst.root?.left);
    expect(bst.root?.right?.left?.parent).toBe(bst.root?.right);
    expect(bst.root?.right?.right?.parent).toBe(bst.root?.right);

    // Remove root
    expect(await bst.remove(15)).toBeTruthy();
    
    // Verify new tree structure and relationships
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(17);
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.right?.data).toBe(20);
    expect(bst.root?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.right?.data).toBe(12);
    expect(bst.root?.right?.right?.data).toBe(25);
    expect(bst.root?.right?.left).toBeNull();
    
    // Verify parent-child relationships after root removal
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.left?.left?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.right?.parent).toBe(bst.root?.left);
    expect(bst.root?.right?.right?.parent).toBe(bst.root?.right);

    // Test Case 6: Remove non-root leaf node
    expect(await bst.remove(5)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(17);
    expect(bst.root?.left?.data).toBe(10);
    expect(bst.root?.left?.left).toBeNull();
    expect(bst.root?.left?.right?.data).toBe(12);
    expect(bst.root?.left?.right?.parent).toBe(bst.root?.left);

    // Test Case 7: Remove non-root node with one child
    expect(await bst.remove(10)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(17);
    expect(bst.root?.left?.data).toBe(12);
    expect(bst.root?.left?.left).toBeNull();
    expect(bst.root?.left?.right).toBeNull();
    expect(bst.root?.left?.parent).toBe(bst.root);

    // Test Case 8: Remove non-root node with two children
    expect(await bst.remove(20)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(17);
    expect(bst.root?.right?.data).toBe(25);
    expect(bst.root?.right?.left).toBeNull();
    expect(bst.root?.right?.right).toBeNull();
    expect(bst.root?.right?.parent).toBe(bst.root);

    // Test Case 9: Remove non-existent value
    expect(await bst.remove(999)).toBeFalsy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(17);
    expect(bst.root?.left?.data).toBe(12);
    expect(bst.root?.right?.data).toBe(25);

    // Test Case 10: Remove all nodes one by one
    expect(await bst.remove(17)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(25);
    expect(bst.root?.left?.data).toBe(12);
    expect(bst.root?.right).toBeNull();

    expect(await bst.remove(25)).toBeTruthy();
    expect(bst.root?.isRoot).toBe(true);
    expect(bst.root?.data).toBe(12);
    expect(bst.root?.left).toBeNull();
    expect(bst.root?.right).toBeNull();
    expect(bst.root?.parent).toBeNull();

    expect(await bst.remove(12)).toBeTruthy();
    expect(bst.root).toBeNull();
  });

  it("Should remove correctly when node has two children with deep nested nodes", async () => {
    const bst = new BinarySearchTree();
    
    // Build a complex tree with deep nested branches:
    //                   50
    //                  /  \
    //                 30   70
    //                /  \
    //               20   40
    //              /  \
    //             10   25
    //            /  \
    //           5    15
    //          /  \
    //         3    7
    //        /
    //       2
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    await bst.insert(20);
    await bst.insert(40);
    await bst.insert(10);
    await bst.insert(25);
    await bst.insert(5);
    await bst.insert(15);
    await bst.insert(3);
    await bst.insert(7);
    await bst.insert(2);

    // Test Case 1: Remove node with deep left subtree (30)
    expect(await bst.remove(30)).toBeTruthy();
    // After removing 30, 40 should be promoted (successor)
    expect(bst.root?.left?.data).toBe(40);
    expect(bst.root?.left?.left?.data).toBe(20);
    expect(bst.root?.left?.right).toBeNull();
    // Verify deep left subtree structure
    expect(bst.root?.left?.left?.left?.data).toBe(10);
    expect(bst.root?.left?.left?.right?.data).toBe(25);
    expect(bst.root?.left?.left?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.right?.data).toBe(15);
    expect(bst.root?.left?.left?.left?.left?.left?.data).toBe(3);
    expect(bst.root?.left?.left?.left?.left?.right?.data).toBe(7);
    expect(bst.root?.left?.left?.left?.left?.left?.left?.data).toBe(2);

    // Verify parent relationships in deep subtree
    expect(bst.root?.left?.parent?.data).toBe(50);
    expect(bst.root?.left?.left?.parent?.data).toBe(40);
    expect(bst.root?.left?.left?.left?.parent?.data).toBe(20);
    expect(bst.root?.left?.left?.left?.left?.parent?.data).toBe(10);
    expect(bst.root?.left?.left?.left?.left?.left?.parent?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.left?.left?.parent?.data).toBe(5);

    // Test Case 2: Remove node with deep right subtree (20)
    expect(await bst.remove(20)).toBeTruthy();
    // After removing 20, 25 should be promoted (successor)
    expect(bst.root?.left?.left?.data).toBe(25);
    expect(bst.root?.left?.left?.left?.data).toBe(10);
    expect(bst.root?.left?.left?.right).toBeNull();
    // Verify deep left subtree structure remains intact
    expect(bst.root?.left?.left?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.right?.data).toBe(15);
    expect(bst.root?.left?.left?.left?.left?.left?.data).toBe(3);
    expect(bst.root?.left?.left?.left?.left?.right?.data).toBe(7);
    expect(bst.root?.left?.left?.left?.left?.left?.left?.data).toBe(2);

    // Verify parent relationships after second removal
    expect(bst.root?.left?.left?.parent?.data).toBe(40);
    expect(bst.root?.left?.left?.left?.parent?.data).toBe(25);
    expect(bst.root?.left?.left?.left?.left?.parent?.data).toBe(10);
    expect(bst.root?.left?.left?.left?.left?.left?.parent?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.left?.left?.left?.parent?.data).toBe(3);

    // Test Case 3: Remove node with successor in deep subtree (10)
    expect(await bst.remove(10)).toBeTruthy();
    // After removing 10, 15 should be promoted (successor)
    expect(bst.root?.left?.left?.left?.data).toBe(15);
    expect(bst.root?.left?.left?.left?.left?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.right).toBeNull();
    // Verify remaining deep subtree structure
    expect(bst.root?.left?.left?.left?.left?.left?.data).toBe(3);
    expect(bst.root?.left?.left?.left?.left?.right?.data).toBe(7);
    expect(bst.root?.left?.left?.left?.left?.left?.left?.data).toBe(2);

    // Verify final parent relationships
    expect(bst.root?.left?.left?.left?.parent?.data).toBe(25);
    expect(bst.root?.left?.left?.left?.left?.parent?.data).toBe(15);
    expect(bst.root?.left?.left?.left?.left?.left?.parent?.data).toBe(5);
    expect(bst.root?.left?.left?.left?.left?.left?.left?.parent?.data).toBe(3);
  });
});

describe("Test inOrderTraversal", async () => {
  it("Should traverse", async () => {
    const bst = new BinarySearchTree();

    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);
    let data = 0;
    bst.inOrderTraversal(null, async (node) => {
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

    const _expected = generateExpectedTreeObj(bst.root!, null,0);
    // Test the tree object
    const testTreeObj = (
      treeObj: TreeObj<BinaryTreeNode<number>>,
      expected: typeof _expected
    ) => {
      expect(treeObj.node.data).toEqual(expected.node);
      expect(treeObj.depth).toEqual(expected.depth);
      expect(treeObj.children.length).toEqual(expected.children.length);
      if(treeObj.parent){

        expect(treeObj.parent.node.data).toEqual(expected.parent?.node)
      }
      for (let i = 0; i < expected.children.length; i++) {
        testTreeObj(treeObj.children[i], expected.children[i]);
      }
    };

    testTreeObj(result, _expected);
  });
});

describe("Testing TreeNode relationships", () => {
  it("should maintain correct parent-child relationships", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test root has no parent
    expect(bst.root?.parent).toBeNull();

    // Test direct parent-child relationships
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.left?.left?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.right?.parent).toBe(bst.root?.left);
    expect(bst.root?.right?.left?.parent).toBe(bst.root?.right);
    expect(bst.root?.right?.right?.parent).toBe(bst.root?.right);
  });

  it("should maintain correct sibling relationships", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test siblings at different levels
    expect(bst.root?.left?.nextSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.previousSibling).toBe(bst.root?.left);
    
    expect(bst.root?.left?.left?.nextSibling).toBe(bst.root?.left?.right);
    expect(bst.root?.left?.right?.previousSibling).toBe(bst.root?.left?.left);
    
    expect(bst.root?.right?.left?.nextSibling).toBe(bst.root?.right?.right);
    expect(bst.root?.right?.right?.previousSibling).toBe(bst.root?.right?.left);

    // Test edge cases
    expect(bst.root?.left?.left?.previousSibling).toBeNull();
    expect(bst.root?.right?.right?.nextSibling).toBeNull();
  });

  it("should maintain correct leftmost/rightmost relationships", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test root level
    expect(bst.root?.leftmostChild).toBe(bst.root?.left);
    expect(bst.root?.rightmostChild).toBe(bst.root?.right);

    // Test second level
    expect(bst.root?.left?.leftmostChild).toBe(bst.root?.left?.left);
    expect(bst.root?.left?.rightmostChild).toBe(bst.root?.left?.right);
    expect(bst.root?.right?.leftmostChild).toBe(bst.root?.right?.left);
    expect(bst.root?.right?.rightmostChild).toBe(bst.root?.right?.right);

    // Test leaf nodes
    expect(bst.root?.left?.left?.leftmostChild).toBeNull();
    expect(bst.root?.left?.left?.rightmostChild).toBeNull();
  });

  it("should maintain correct leftmost/rightmost sibling relationships", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test root level
    expect(bst.root?.leftmostSibling).toBeNull();
    expect(bst.root?.rightmostSibling).toBeNull();

    // Test second level
    expect(bst.root?.left?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.left?.rightmostSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.right?.rightmostSibling).toBe(bst.root?.right);

    // Test third level
    expect(bst.root?.left?.left?.leftmostSibling).toBe(bst.root?.left?.left);
    expect(bst.root?.left?.left?.rightmostSibling).toBe(bst.root?.left?.right);
    expect(bst.root?.left?.right?.leftmostSibling).toBe(bst.root?.left?.left);
    expect(bst.root?.left?.right?.rightmostSibling).toBe(bst.root?.left?.right);
  });

  it("should maintain correct mod values", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test mod values are initialized to 0
    expect(bst.root?.mod).toBe(0);
    expect(bst.root?.left?.mod).toBe(0);
    expect(bst.root?.right?.mod).toBe(0);

    // Test mod values can be set
    bst.root!.mod = 5;
    expect(bst.root?.mod).toBe(5);

    bst.root!.left!.mod = -3;
    expect(bst.root?.left?.mod).toBe(-3);
  });

  it("should maintain correct isRoot property", async () => {
    const bst = new BinarySearchTree();
    await buildATree([15, 10, 20, 5, 12, 17, 25], bst);

    // Test root node has isRoot set to true
    expect(bst.root?.isRoot).toBe(true);

    // Test non-root nodes have isRoot set to false
    expect(bst.root?.left?.isRoot).toBe(false);
    expect(bst.root?.right?.isRoot).toBe(false);
    expect(bst.root?.left?.left?.isRoot).toBe(false);
    expect(bst.root?.left?.right?.isRoot).toBe(false);
    expect(bst.root?.right?.left?.isRoot).toBe(false);
    expect(bst.root?.right?.right?.isRoot).toBe(false);

    // Test isRoot can be set
    bst.root!.left!.isRoot = true;
    expect(bst.root?.left?.isRoot).toBe(true);
  });

  it("should maintain correct parent-child relationships during complex operations", async () => {
    const bst = new BinarySearchTree();
    
    // Build tree incrementally and verify relationships at each step
    await bst.insert(15);
    expect(bst.root?.parent).toBeNull();
    expect(bst.root?.isRoot).toBe(true);

    await bst.insert(10);
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.left?.isRoot).toBe(false);

    await bst.insert(20);
    expect(bst.root?.right?.parent).toBe(bst.root);
    expect(bst.root?.right?.isRoot).toBe(false);

    // Test relationships after removal
    await bst.remove(10);
    expect(bst.root?.left).toBeNull();
    expect(bst.root?.right?.parent).toBe(bst.root);

    // Test relationships after reinsertion
    await bst.insert(10);
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.left?.isRoot).toBe(false);
  });

  it("should maintain correct sibling relationships in complex scenarios", async () => {
    const bst = new BinarySearchTree();
    
    // Test siblings with sequential insertions
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    await bst.insert(20);
    await bst.insert(40);
    await bst.insert(60);
    await bst.insert(80);

    // Test all sibling relationships
    expect(bst.root?.left?.nextSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.previousSibling).toBe(bst.root?.left);
    
    expect(bst.root?.left?.left?.nextSibling).toBe(bst.root?.left?.right);
    expect(bst.root?.left?.right?.previousSibling).toBe(bst.root?.left?.left);
    
    expect(bst.root?.right?.left?.nextSibling).toBe(bst.root?.right?.right);
    expect(bst.root?.right?.right?.previousSibling).toBe(bst.root?.right?.left);

    // Test sibling relationships after removal
    await bst.remove(40);
    expect(bst.root?.left?.left?.nextSibling).toBeNull();
    
    await bst.remove(20);
    expect(bst.root?.left?.left).toBeNull();
    expect(bst.root?.left?.right).toBeNull();
  });

  it("should maintain correct leftmost/rightmost relationships in complex scenarios", async () => {
    const bst = new BinarySearchTree();
    
    // Build an unbalanced tree
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    await bst.insert(20);
    await bst.insert(40);
    await bst.insert(35);
    await bst.insert(45);

    // Test leftmost/rightmost at each level
    expect(bst.root?.leftmostChild).toBe(bst.root?.left);
    expect(bst.root?.rightmostChild).toBe(bst.root?.right);
    
    expect(bst.root?.left?.leftmostChild).toBe(bst.root?.left?.left);
    expect(bst.root?.left?.rightmostChild).toBe(bst.root?.left?.right);
    
    expect(bst.root?.left?.right?.leftmostChild).toBe(bst.root?.left?.right?.left);
    expect(bst.root?.left?.right?.rightmostChild).toBe(bst.root?.left?.right?.right);

    // Test after removing nodes
    await bst.remove(35);
    expect(bst.root?.left?.right?.left).toBeNull();
    expect(bst.root?.left?.right?.leftmostChild).toBe(bst.root?.left?.right?.right);
    expect(bst.root?.left?.right?.rightmostChild).toBe(bst.root?.left?.right?.right);
    
    await bst.remove(45);
    expect(bst.root?.left?.right?.left).toBeNull();
    expect(bst.root?.left?.right?.right).toBeNull();
    expect(bst.root?.left?.right?.leftmostChild).toBeNull();
    expect(bst.root?.left?.right?.rightmostChild).toBeNull();
  });

  it("should maintain correct leftmost/rightmost sibling relationships during modifications", async () => {
    const bst = new BinarySearchTree();
    
    // Build tree incrementally
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    await bst.insert(20);
    await bst.insert(40);
    await bst.insert(60);
    await bst.insert(80);

    // Test initial relationships
    expect(bst.root?.leftmostSibling).toBeNull();
    expect(bst.root?.rightmostSibling).toBeNull();

    expect(bst.root?.left?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.left?.rightmostSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.right?.rightmostSibling).toBe(bst.root?.right);

    // Test after modifications
    await bst.remove(30);
    expect(bst.root?.left?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.left?.rightmostSibling).toBe(bst.root?.right);

    await bst.remove(70);
    expect(bst.root?.right?.leftmostSibling).toBe(bst.root?.left);
    expect(bst.root?.right?.rightmostSibling).toBe(bst.root?.right);
  });

  it("should handle node relationship updates during rotations and restructuring", async () => {
    const bst = new BinarySearchTree();
    
    // Create a complex tree structure
    await bst.insert(50);
    await bst.insert(30);
    await bst.insert(70);
    await bst.insert(20);
    await bst.insert(40);
    await bst.insert(60);
    await bst.insert(80);
    await bst.insert(35);
    await bst.insert(45);

    // Test relationships before modifications
    expect(bst.root?.data).toBe(50);
    expect(bst.root?.left?.data).toBe(30);
    expect(bst.root?.right?.data).toBe(70);

    // Remove nodes that cause tree restructuring
    await bst.remove(30);
    
    // Verify relationships after restructuring
    expect(bst.root?.left?.parent).toBe(bst.root);
    expect(bst.root?.left?.isRoot).toBe(false);
    expect(bst.root?.left?.leftmostChild?.parent).toBe(bst.root?.left);
    expect(bst.root?.left?.rightmostChild?.parent).toBe(bst.root?.left);

    // Test sibling relationships after restructuring
    expect(bst.root?.left?.nextSibling).toBe(bst.root?.right);
    expect(bst.root?.right?.previousSibling).toBe(bst.root?.left);
  });

  it("should maintain correct relationships during edge case operations", async () => {
    const bst = new BinarySearchTree();
    
    // Test single node
    await bst.insert(50);
    expect(bst.root?.leftmostSibling).toBeNull();
    expect(bst.root?.rightmostSibling).toBeNull();
    expect(bst.root?.leftmostChild).toBeNull();
    expect(bst.root?.rightmostChild).toBeNull();
    expect(bst.root?.parent).toBeNull();
    expect(bst.root?.isRoot).toBe(true);

    // Test removing root
    await bst.remove(50);
    expect(bst.root).toBeNull();

    // Test relationships with only left children
    await bst.insert(50);
    await bst.insert(40);
    await bst.insert(30);
    expect(bst.root?.leftmostChild).toBe(bst.root?.left);
    expect(bst.root?.rightmostChild).toBe(bst.root?.left);
    expect(bst.root?.left?.leftmostChild).toBe(bst.root?.left?.left);
    expect(bst.root?.left?.rightmostChild).toBe(bst.root?.left?.left);

    // Test relationships with only right children
    bst.clear();
    await bst.insert(50);
    await bst.insert(60);
    await bst.insert(70);
    expect(bst.root?.leftmostChild).toBe(bst.root?.right);
    expect(bst.root?.rightmostChild).toBe(bst.root?.right);
    expect(bst.root?.right?.leftmostChild).toBe(bst.root?.right?.right);
    expect(bst.root?.right?.rightmostChild).toBe(bst.root?.right?.right);
  });
});

describe("BinarySearchTree Remove Cases", () => {
  describe("Case 1: Remove node with no children", () => {
    let bst: BinarySearchTree<number>;

    beforeEach(async () => {
      bst = new BinarySearchTree();
      // Create a tree:
      //       10
      //      /  \
      //     5    15
      //    /      \
      //   3        20
      await bst.insert(10);
      await bst.insert(5);
      await bst.insert(15);
      await bst.insert(3);
      await bst.insert(20);
    });

    it("should remove a leaf node correctly", async () => {
      expect(await bst.remove(3)).toBeTruthy();
      expect(bst.root?.left?.left).toBeNull();
      expect(bst.root?.left?.data).toBe(5);
    });

    it("should remove multiple leaf nodes correctly", async () => {
      expect(await bst.remove(3)).toBeTruthy();
      expect(await bst.remove(20)).toBeTruthy();
      expect(bst.root?.left?.left).toBeNull();
      expect(bst.root?.right?.right).toBeNull();
    });

    it("should handle removing non-existent leaf nodes", async () => {
      expect(await bst.remove(7)).toBeFalsy();
      expect(bst.root?.left?.data).toBe(5);
      expect(bst.root?.left?.left?.data).toBe(3);
    });
  });

  describe("Case 2: Remove node with one child", () => {
    let bst: BinarySearchTree<number>;

    beforeEach(async () => {
      bst = new BinarySearchTree();
      // Create a tree:
      //       10
      //      /  \
      //     5    15
      //    /      \
      //   3        20
      //  /          \
      // 1           25
      await bst.insert(10);
      await bst.insert(5);
      await bst.insert(15);
      await bst.insert(3);
      await bst.insert(20);
      await bst.insert(1);
      await bst.insert(25);
    });

    it("should remove node with left child correctly", async () => {
      expect(await bst.remove(3)).toBeTruthy();
      expect(bst.root?.left?.left?.data).toBe(1);
      expect(bst.root?.left?.left?.parent?.data).toBe(5);
    });

    it("should remove node with right child correctly", async () => {
      expect(await bst.remove(15)).toBeTruthy();
      expect(bst.root?.right?.data).toBe(20);
      expect(bst.root?.right?.right?.data).toBe(25);
      expect(bst.root?.right?.parent?.data).toBe(10);
    });

    it("should handle chain of single-child removes", async () => {
      expect(await bst.remove(20)).toBeTruthy();
      expect(await bst.remove(15)).toBeTruthy();
      expect(bst.root?.right?.data).toBe(25);
      expect(bst.root?.right?.parent?.data).toBe(10);
    });
  });

  describe("Case 3: Remove node with two children", () => {
    let bst: BinarySearchTree<number>;

    beforeEach(async () => {
      bst = new BinarySearchTree();
      // Create a complex tree:
      //                 20
      //         /                \
      //        10                30
      //     /      \          /      \
      //    5        15      25        35
      //   / \      /  \    /  \      /  \
      //  2   7   12    17  23  27   32   40
      //     /    /  \    \      \        / \
      //    6    11   13   18     28     37  42
      //                                 /
      //                                36
      await bst.insert(20);
      await bst.insert(10);
      await bst.insert(30);
      await bst.insert(5);
      await bst.insert(15);
      await bst.insert(25);
      await bst.insert(35);
      await bst.insert(2);
      await bst.insert(7);
      await bst.insert(12);
      await bst.insert(17);
      await bst.insert(23);
      await bst.insert(27);
      await bst.insert(32);
      await bst.insert(40);
      await bst.insert(6);
      await bst.insert(11);
      await bst.insert(13);
      await bst.insert(18);
      await bst.insert(28);
      await bst.insert(37);
      await bst.insert(42);
      await bst.insert(36);
    });

    it("should remove root with two children and maintain structure", async () => {
      expect(await bst.remove(20)).toBeTruthy();
      // After removing 20, 23 should become root (successor)
      expect(bst.root?.data).toBe(23);
      expect(bst.root?.isRoot).toBe(true);
      // Verify immediate children
      expect(bst.root?.left?.data).toBe(10);
      expect(bst.root?.right?.data).toBe(30);
      // Verify parent relationships
      expect(bst.root?.left?.parent?.data).toBe(23);
      expect(bst.root?.right?.parent?.data).toBe(23);
      // Verify the structure remains intact
      expect(bst.root?.right?.left?.data).toBe(25);
      expect(bst.root?.right?.right?.data).toBe(35);
    });

    it("should handle removal of nodes with complex subtrees", async () => {
      // Remove 30 which has a complex right subtree
      expect(await bst.remove(30)).toBeTruthy();
      expect(bst.root?.right?.data).toBe(32);
      expect(bst.root?.right?.right?.data).toBe(35);
      expect(bst.root?.right?.left?.data).toBe(25);
      // Verify parent relationships in restructured subtree
      expect(bst.root?.right?.parent?.data).toBe(20);
      expect(bst.root?.right?.right?.parent?.data).toBe(32);
      expect(bst.root?.right?.left?.parent?.data).toBe(32);
    });

    it("should maintain BST properties after multiple complex removals", async () => {
      // Remove multiple nodes that require complex restructuring
      expect(await bst.remove(10)).toBeTruthy();  // Remove left subtree root
      expect(await bst.remove(35)).toBeTruthy();  // Remove right subtree node
      expect(await bst.remove(20)).toBeTruthy();  // Remove tree root
      
      // Verify the tree structure remains valid
      const verifyBSTProperty = (node: BinaryTreeNode<number> | null): boolean => {
        if (!node) return true;
        if (node.left && node.left.data >= node.data) return false;
        if (node.right && node.right.data <= node.data) return false;
        return verifyBSTProperty(node.left) && verifyBSTProperty(node.right);
      };
      
      expect(verifyBSTProperty(bst.root)).toBe(true);
      
      // Verify specific node relationships after multiple removals
      expect(bst.root?.data).toBe(23);
      expect(bst.root?.left?.data).toBe(11);
      expect(bst.root?.right?.data).toBe(30);
    });

    it("should handle removal of nodes with deep successor chains", async () => {
      // Remove node that requires finding a deep successor
      expect(await bst.remove(30)).toBeTruthy();
      expect(bst.root?.right?.data).toBe(32);
      // Verify the deep right subtree structure
      expect(bst.root?.right?.right?.data).toBe(35);
      expect(bst.root?.right?.right?.right?.data).toBe(40);
      expect(bst.root?.right?.right?.right?.left?.data).toBe(37);
      expect(bst.root?.right?.right?.right?.left?.left?.data).toBe(36);
      // Verify parent relationships in deep chain
      expect(bst.root?.right?.right?.parent?.data).toBe(32);
      expect(bst.root?.right?.right?.right?.parent?.data).toBe(35);
    });

    it("should handle removal of nodes with maximum height difference in subtrees", async () => {
      // Create height imbalance and remove nodes
      await bst.insert(41);
      await bst.insert(43);
      await bst.insert(44);
      
      // Remove node with imbalanced subtrees
      expect(await bst.remove(35)).toBeTruthy();
      
      // Verify structure of the imbalanced area
      expect(bst.root?.right?.right?.data).toBe(36);
      expect(bst.root?.right?.right?.right?.data).toBe(40);
      expect(bst.root?.right?.right?.right?.right?.data).toBe(42);
      
      // Verify parent relationships in imbalanced area
      expect(bst.root?.right?.right?.parent?.data).toBe(30);
      expect(bst.root?.right?.right?.right?.parent?.data).toBe(36);
    });
  });
});

describe("Testing BST Size Property", () => {
  let bst: BinarySearchTree<number>;

  beforeEach(() => {
    bst = new BinarySearchTree();
  });

  it("should initialize with size 0", () => {
    expect(bst.size).toBe(0);
  });

  it("should increment size on successful insertions", async () => {
    await bst.insert(10);
    expect(bst.size).toBe(1);

    await bst.insert(5);
    await bst.insert(15);
    expect(bst.size).toBe(3);
  });

  it("should not increment size on duplicate insertions", async () => {
    await bst.insert(10);
    await bst.insert(10); // Duplicate
    expect(bst.size).toBe(1);

    await bst.insert(5);
    await bst.insert(5); // Duplicate
    expect(bst.size).toBe(2);
  });

  it("should decrement size on successful removals", async () => {
    // Setup tree
    await bst.insert(20);
    await bst.insert(10);
    await bst.insert(30);
    await bst.insert(5);
    await bst.insert(15);
    await bst.insert(25);
    await bst.insert(35);
    expect(bst.size).toBe(7);

    // Test removal of leaf node
    await bst.remove(5);
    expect(bst.size).toBe(6);

    // Test removal of node with one child
    await bst.remove(30);
    expect(bst.size).toBe(5);

    // Test removal of node with two children
    await bst.remove(20);
    expect(bst.size).toBe(4);
  });

  it("should not decrement size on unsuccessful removals", async () => {
    // Setup tree
    await bst.insert(20);
    await bst.insert(10);
    await bst.insert(30);
    expect(bst.size).toBe(3);

    // Try to remove non-existent nodes
    await bst.remove(25);
    expect(bst.size).toBe(3);

    await bst.remove(15);
    expect(bst.size).toBe(3);
  });

  it("should handle size correctly when removing root", async () => {
    // Test root removal when it's the only node
    await bst.insert(10);
    expect(bst.size).toBe(1);
    await bst.remove(10);
    expect(bst.size).toBe(0);

    // Test root removal with children
    await bst.insert(20);
    await bst.insert(10);
    await bst.insert(30);
    expect(bst.size).toBe(3);
    await bst.remove(20);
    expect(bst.size).toBe(2);
  });

  it("should maintain correct size during complex operations", async () => {
    // Build a complex tree
    const values = [20, 10, 30, 5, 15, 25, 35, 3, 7, 13, 17, 23, 27, 33, 37];
    for (const value of values) {
      await bst.insert(value);
    }
    expect(bst.size).toBe(values.length);

    // Remove nodes in different scenarios
    await bst.remove(3);  // leaf
    await bst.remove(10); // two children
    await bst.remove(35); // one child
    await bst.remove(20); // root
    expect(bst.size).toBe(values.length - 4);

    // Try inserting some removed values back
    await bst.insert(3);
    await bst.insert(10);
    expect(bst.size).toBe(values.length - 2);
  });
});
