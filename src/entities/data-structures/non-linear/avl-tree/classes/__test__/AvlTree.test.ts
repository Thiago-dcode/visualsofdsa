import BinaryTreeNode from "../../../tree/_classes/BinaryTreeNode";
import { TreeObj } from "../../../tree/types";
import { RotationType } from "../../types";
import { AvlTree } from "../AvlTree";
import AvlTreeNode from "../AvlTreeNode";

const build = async (values: number[]) => {
  const tree = new AvlTree<number>();
  for (const v of values) await tree.insert(v);
  return tree;
};

const inOrder = (node: BinaryTreeNode<number> | null, out: number[] = []) => {
  if (!node) return out;
  inOrder(node.left, out);
  out.push(node.data);
  inOrder(node.right, out);
  return out;
};

const shape = (node: BinaryTreeNode<number> | null): unknown =>
  node ? [node.data, shape(node.left), shape(node.right)] : null;

/** Checks heights, balance, BST order and structural pointers. Returns node count. */
const assertValid = (tree: AvlTree<number>) => {
  const seen: number[] = [];
  const walk = (
    node: BinaryTreeNode<number> | null,
    parent: BinaryTreeNode<number> | null,
  ): number => {
    if (!node) return 0;
    expect(node).toBeInstanceOf(AvlTreeNode);
    expect(node.parent).toBe(parent);
    expect(node.isRoot).toBe(parent === null);
    const l = walk(node.left, node);
    const r = walk(node.right, node);
    const avl = node as AvlTreeNode<number>;
    expect(avl.height).toBe(1 + Math.max(heightOf(node.left), heightOf(node.right)));
    expect(Math.abs(avl.balanceFactor)).toBeLessThanOrEqual(1);
    seen.push(node.data);
    return l + r + 1;
  };
  const heightOf = (n: BinaryTreeNode<number> | null): number =>
    n ? 1 + Math.max(heightOf(n.left), heightOf(n.right)) : 0;
  const count = walk(tree.root, null);
  expect(count).toBe(tree.size);
  const ordered = inOrder(tree.root);
  for (let i = 1; i < ordered.length; i++) expect(ordered[i]).toBeGreaterThan(ordered[i - 1]);
  expect(ordered).toHaveLength(tree.size);
  return count;
};

/** Small deterministic PRNG (mulberry32) so failures are reproducible. */
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

describe("AVL rotations (AC-1)", () => {
  it("AC-AVL-1: 10,20,30 gives root 20 (right-right case)", async () => {
    const tree = await build([10, 20, 30]);
    expect(shape(tree.root)).toEqual([20, [10, null, null], [30, null, null]]);
  });

  it("AC-AVL-1: 30,20,10 gives root 20 (left-left case)", async () => {
    const tree = await build([30, 20, 10]);
    expect(shape(tree.root)).toEqual([20, [10, null, null], [30, null, null]]);
  });

  it("AC-AVL-1: 30,10,20 gives root 20 (left-right case)", async () => {
    const tree = await build([30, 10, 20]);
    expect(shape(tree.root)).toEqual([20, [10, null, null], [30, null, null]]);
  });

  it("AC-AVL-1: 10,30,20 gives root 20 (right-left case)", async () => {
    const tree = await build([10, 30, 20]);
    expect(shape(tree.root)).toEqual([20, [10, null, null], [30, null, null]]);
  });

  it("AC-AVL-1: rotation inside a subtree keeps the parent link and order", async () => {
    const tree = await build([50, 30, 70, 20, 10]);
    expect(shape(tree.root)).toEqual([
      50,
      [20, [10, null, null], [30, null, null]],
      [70, null, null],
    ]);
    assertValid(tree);
  });
});

describe("AVL balance invariants (AC-2, AC-3)", () => {
  it("AC-AVL-2: 1..127 ascending is perfectly balanced with height 7", async () => {
    const tree = await build(Array.from({ length: 127 }, (_, i) => i + 1));
    expect((tree.root as AvlTreeNode<number>).height).toBe(7);
    expect(assertValid(tree)).toBe(127);
    expect(tree.root?.data).toBe(64);
  });

  it("AC-AVL-2: 127..1 descending is perfectly balanced with height 7", async () => {
    const tree = await build(Array.from({ length: 127 }, (_, i) => 127 - i));
    expect((tree.root as AvlTreeNode<number>).height).toBe(7);
    assertValid(tree);
  });

  it("AC-AVL-2/3: invariants hold after every one of 500 random inserts", async () => {
    const rand = rng(1234);
    const tree = new AvlTree<number>();
    const model = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = Math.floor(rand() * 2000);
      const res = await tree.insert(v);
      if (model.has(v)) expect(res).toBeNull();
      else expect(res).not.toBeNull();
      model.add(v);
      expect(tree.size).toBe(model.size);
      if (i % 10 === 0) assertValid(tree);
    }
    assertValid(tree);
    expect(inOrder(tree.root)).toEqual([...model].sort((a, b) => a - b));
  });

  it("AC-AVL-2/3: invariants hold after 500 random mixed inserts and removes", async () => {
    const rand = rng(98765);
    const tree = new AvlTree<number>();
    const model = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = Math.floor(rand() * 150);
      if (rand() < 0.55) {
        await tree.insert(v);
        model.add(v);
      } else {
        const removed = await tree.remove(v);
        expect(removed).toBe(model.has(v));
        model.delete(v);
      }
      expect(tree.size).toBe(model.size);
      assertValid(tree);
    }
    expect(inOrder(tree.root)).toEqual([...model].sort((a, b) => a - b));
  }, 60000);

  it("AC-AVL-2: removing every value in random order keeps the tree valid and ends empty", async () => {
    const rand = rng(42);
    const values = Array.from({ length: 200 }, (_, i) => i);
    const tree = await build(values);
    const shuffled = [...values].sort(() => rand() - 0.5);
    for (const v of shuffled) {
      expect(await tree.remove(v)).toBe(true);
      assertValid(tree);
    }
    expect(tree.size).toBe(0);
    expect(tree.root).toBeNull();
  }, 60000);
});

describe("AVL duplicates (AC-4)", () => {
  it("AC-AVL-4: duplicate insert returns null, keeps size and fires no rotation", async () => {
    const tree = await build([10, 20, 30]);
    const onRotate = vi.fn(async () => {});
    const result = await tree.insert(20, null, onRotate);
    expect(result).toBeNull();
    expect(tree.size).toBe(3);
    expect(onRotate).not.toHaveBeenCalled();
    assertValid(tree);
  });

  it("AC-AVL-4: duplicate of the root on a one node tree", async () => {
    const tree = await build([5]);
    expect(await tree.insert(5)).toBeNull();
    expect(tree.size).toBe(1);
  });
});

describe("AVL remove (AC-5)", () => {
  it("AC-AVL-5: removes a leaf", async () => {
    const tree = await build([20, 10, 30, 5]);
    expect(await tree.remove(5)).toBe(true);
    expect(inOrder(tree.root)).toEqual([10, 20, 30]);
    assertValid(tree);
  });

  it("AC-AVL-5: removes a node with one child", async () => {
    const tree = await build([20, 10, 30, 5]);
    expect(await tree.remove(10)).toBe(true);
    expect(inOrder(tree.root)).toEqual([5, 20, 30]);
    assertValid(tree);
  });

  it("AC-AVL-5: removes a node with two children using the in-order successor", async () => {
    const tree = await build([20, 10, 30, 25, 40]);
    expect(await tree.remove(30)).toBe(true);
    expect(inOrder(tree.root)).toEqual([10, 20, 25, 40]);
    assertValid(tree);
    const tree2 = await build([50, 30, 70, 20, 40, 60, 80, 65]);
    expect(await tree2.remove(50)).toBe(true);
    expect(tree2.root?.data).toBe(60);
    assertValid(tree2);
  });

  it("AC-AVL-5: removes the root (single node, then with children)", async () => {
    const single = await build([1]);
    expect(await single.remove(1)).toBe(true);
    expect(single.root).toBeNull();
    expect(single.size).toBe(0);

    const tree = await build([20, 10, 30]);
    expect(await tree.remove(20)).toBe(true);
    expect(inOrder(tree.root)).toEqual([10, 30]);
    expect(tree.root?.isRoot).toBe(true);
    assertValid(tree);
  });

  it("AC-AVL-5: absent value returns false and leaves size unchanged", async () => {
    const tree = await build([20, 10, 30]);
    expect(await tree.remove(99)).toBe(false);
    expect(tree.size).toBe(3);
    expect(await new AvlTree<number>().remove(1)).toBe(false);
  });

  it("AC-AVL-5: removal that triggers a rotation rebalances", async () => {
    // 20 has left 10 and right 30, 30 has right 40; removing 10 unbalances 20.
    const tree = await build([20, 10, 30, 40]);
    const onRotate = vi.fn(async () => {});
    expect(await tree.remove(10, null, null, null, onRotate)).toBe(true);
    expect(onRotate).toHaveBeenCalledTimes(1);
    expect(shape(tree.root)).toEqual([30, [20, null, null], [40, null, null]]);
    assertValid(tree);
  });
});

describe("AVL search (AC-6)", () => {
  it("AC-AVL-6: returns the node or null", async () => {
    const tree = await build([20, 10, 30]);
    expect((await tree.search(30))?.data).toBe(30);
    expect(await tree.search(31)).toBeNull();
    expect(await new AvlTree<number>().search(1)).toBeNull();
  });

  it("AC-AVL-6: onCompare fires once per visited node, root first, with the edge to that node", async () => {
    const tree = await build([20, 10, 30, 25]);
    const calls: { data: number; edge: unknown }[] = [];
    await tree.search(25, async (node, edge) => {
      calls.push({ data: node.data, edge });
    });
    expect(calls.map((c) => c.data)).toEqual([20, 30, 25]);
    expect(calls[0].edge).toBeNull();
    const root = tree.root as AvlTreeNode<number>;
    expect(calls[1].edge).toBe(root.rightEdge);
    expect(calls[2].edge).toBe(root.right?.leftEdge);
  });

  it("AC-AVL-6: a missed search visits the whole path", async () => {
    const tree = await build([20, 10, 30]);
    const visited: number[] = [];
    await tree.search(5, async (node) => {
      visited.push(node.data);
    });
    expect(visited).toEqual([20, 10]);
  });
});

describe("AVL onRotate (AC-7)", () => {
  const collect = async (values: number[]) => {
    const tree = new AvlTree<number>();
    const events: { type: RotationType; pivot: number; top: number; atPivotSpot: boolean }[] = [];
    for (const v of values) {
      await tree.insert(v, null, async (type, pivot, top) => {
        events.push({
          type,
          pivot: pivot.data,
          top: top.data,
          // the new subtree root now sits where the pivot was: it is the pivot's parent
          atPivotSpot: pivot.parent === top,
        });
      });
    }
    return { tree, events };
  };

  it("AC-AVL-7: a single rotation fires exactly once (right-right => left)", async () => {
    const { events } = await collect([10, 20, 30]);
    expect(events).toEqual([{ type: "left", pivot: 10, top: 20, atPivotSpot: true }]);
  });

  it("AC-AVL-7: left-left => right", async () => {
    const { events } = await collect([30, 20, 10]);
    expect(events).toEqual([{ type: "right", pivot: 30, top: 20, atPivotSpot: true }]);
  });

  it("AC-AVL-7: double rotations are reported as one left-right / right-left event", async () => {
    const lr = await collect([30, 10, 20]);
    expect(lr.events).toHaveLength(1);
    expect(lr.events[0]).toMatchObject({ type: "left-right", pivot: 30, top: 20 });
    const rl = await collect([10, 30, 20]);
    expect(rl.events).toHaveLength(1);
    expect(rl.events[0]).toMatchObject({ type: "right-left", pivot: 10, top: 20 });
  });

  it("AC-AVL-7: no rotation fires for a balanced insert", async () => {
    const { events } = await collect([20, 10, 30, 5, 15]);
    expect(events).toHaveLength(0);
  });

  it("AC-AVL-7: the reported newSubtreeRoot sits at the pivot's old position in the tree", async () => {
    const tree = new AvlTree<number>();
    for (const v of [50, 30, 70, 20]) await tree.insert(v);
    let seen: { pivot: AvlTreeNode<number>; top: AvlTreeNode<number> } | null = null;
    await tree.insert(10, null, async (_t, pivot, top) => {
      seen = { pivot, top };
    });
    expect(seen).not.toBeNull();
    const s = seen as unknown as { pivot: AvlTreeNode<number>; top: AvlTreeNode<number> };
    expect(s.pivot.data).toBe(30);
    expect(s.top.data).toBe(20);
    expect(tree.root?.left).toBe(s.top);
  });
});

describe("AVL min, max, clear (AC-8)", () => {
  it("AC-AVL-8: min/max return smallest/largest node, null when empty", async () => {
    const empty = new AvlTree<number>();
    expect(empty.min).toBeNull();
    expect(empty.max).toBeNull();
    const tree = await build([20, 10, 30, 5, 40, 25]);
    expect(tree.min?.data).toBe(5);
    expect(tree.max?.data).toBe(40);
  });

  it("AC-AVL-8: clear empties the tree and it is reusable", async () => {
    const tree = await build([20, 10, 30]);
    tree.clear();
    expect(tree.root).toBeNull();
    expect(tree.size).toBe(0);
    expect(tree.min).toBeNull();
    await tree.insert(7);
    expect(tree.root?.data).toBe(7);
    expect(tree.root?.isRoot).toBe(true);
    expect(tree.size).toBe(1);
  });
});

describe("AVL structure consistency (AC-9)", () => {
  const checkTreeObj = (obj: TreeObj<BinaryTreeNode<number>>, depth: number) => {
    expect(obj.depth).toBe(depth);
    expect(obj.node.isRoot).toBe(depth === 0);
    for (const child of obj.children) {
      expect(child.parent).toBe(obj);
      expect(child.node.parent).toBe(obj.node);
      checkTreeObj(child, depth + 1);
    }
    expect(obj.children.map((c) => c.node)).toEqual(
      [obj.node.left, obj.node.right].filter(Boolean),
    );
  };

  it("AC-AVL-9: only the root has isRoot and parents are coherent after rotations", async () => {
    const tree = await build(Array.from({ length: 63 }, (_, i) => i + 1));
    let roots = 0;
    await tree.inOrderTraversal(tree.root, async (n) => {
      if (n.isRoot) roots++;
    });
    expect(roots).toBe(1);
    assertValid(tree);
  });

  it("AC-AVL-9: toTreeObj depths are consistent after inserts and removals", async () => {
    const rand = rng(7);
    const tree = new AvlTree<number>();
    for (let i = 0; i < 80; i++) await tree.insert(Math.floor(rand() * 300));
    for (let i = 0; i < 40; i++) await tree.remove(Math.floor(rand() * 300));
    const obj = tree.toTreeObj();
    expect(obj).not.toBeNull();
    if (obj) checkTreeObj(obj, 0);
  });

  it("AC-AVL-9: isLeftmost / isRightmost match the child slot after rotations", async () => {
    const tree = await build(Array.from({ length: 40 }, (_, i) => i + 1));
    await tree.inOrderTraversal(tree.root, async (n) => {
      if (!n.parent) return;
      if (n.parent.left === n) {
        expect(n.isLeftmost).toBe(true);
        expect(n.isRightmost).toBe(false);
      } else {
        expect(n.isRightmost).toBe(true);
        expect(n.isLeftmost).toBe(false);
      }
    });
  });

  it("AC-AVL-9: edges are distinct objects per child slot (no stale shared edge)", async () => {
    const tree = await build(Array.from({ length: 31 }, (_, i) => i + 1));
    const edges = new Set<unknown>();
    let slots = 0;
    await tree.inOrderTraversal(tree.root, async (n) => {
      edges.add(n.leftEdge);
      edges.add(n.rightEdge);
      slots += 2;
    });
    expect(edges.size).toBe(slots);
  });

  it("AC-AVL-9: a removed node is detached", async () => {
    const tree = await build([20, 10, 30]);
    const node = await tree.search(10);
    await tree.remove(10);
    expect(node?.parent).toBeNull();
    expect(tree.root?.left).toBeNull();
  });
});
