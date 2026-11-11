import { Edge } from "@/lib/classes/Edge";
import Position from "@/lib/classes/position/Position";
import BinaryTree from "../../tree/_classes/BinaryTree";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";

export type HeapMode = "min" | "max";

export type HeapHooks = {
  /** Fired after a new value is appended at `index`, before it sifts up. */
  onAdd?: (index: number) => Promise<void>;
  /** Fired for every comparison between the values stored at two indices. */
  onCompare?: (i: number, j: number) => Promise<void>;
  /** Fired right after the values at the two indices were exchanged. */
  onSwap?: (i: number, j: number) => Promise<void>;
  /**
   * Fired by `extract` once the last value was moved to the root (and its old slot
   * removed). `fromIndex` is the index the value came from.
   */
  onSetRoot?: (fromIndex: number) => Promise<void>;
};

/**
 * Read-only view of the heap shaped as a binary tree so `TreeLayout` and
 * `TreeVisualization` can render it. It is kept in sync by `BinaryHeap`.
 */
export class HeapTree extends BinaryTree<number> {
  sync(root: BinaryTreeNode<number> | null, size: number) {
    this._root = root;
    this._size = size;
  }
}

/**
 * Array-backed binary heap. The nodes of the tree view are stable per index and a swap
 * exchanges their `data`, so the tree structure only changes when a value is appended or
 * removed from the end.
 */
export class BinaryHeap {
  private nodes: BinaryTreeNode<number>[] = [];
  private _mode: HeapMode;
  private readonly tree = new HeapTree();

  constructor(mode: HeapMode = "min") {
    this._mode = mode;
  }

  static parent(i: number) {
    return (i - 1) >> 1;
  }
  static left(i: number) {
    return 2 * i + 1;
  }
  static right(i: number) {
    return 2 * i + 2;
  }

  get mode() {
    return this._mode;
  }
  get size() {
    return this.nodes.length;
  }
  get height() {
    return this.nodes.length === 0 ? 0 : 32 - Math.clz32(this.nodes.length);
  }

  toArray(): number[] {
    return this.nodes.map((node) => node.data);
  }
  peek(): number | null {
    return this.nodes.length > 0 ? this.nodes[0].data : null;
  }
  nodeAt(i: number): BinaryTreeNode<number> | null {
    return this.nodes[i] ?? null;
  }
  indexOf(node: BinaryTreeNode<number>): number {
    return this.nodes.indexOf(node);
  }
  toTreeView(): HeapTree {
    return this.tree;
  }

  async insert(value: number, hooks: HeapHooks = {}): Promise<{ index: number; swaps: number }> {
    this.append(value);
    const index = this.nodes.length - 1;
    if (hooks.onAdd) await hooks.onAdd(index);
    return this.siftUp(index, hooks);
  }

  async extract(hooks: HeapHooks = {}): Promise<number | null> {
    if (this.nodes.length === 0) return null;
    const rootValue = this.nodes[0].data;
    const lastIndex = this.nodes.length - 1;
    if (lastIndex === 0) {
      this.removeLast();
      return rootValue;
    }
    this.nodes[0].data = this.nodes[lastIndex].data;
    this.removeLast();
    if (hooks.onSetRoot) await hooks.onSetRoot(lastIndex);
    await this.siftDown(0, hooks);
    return rootValue;
  }

  /** Floyd's bottom-up construction. Replaces the current content. */
  async buildHeap(values: number[], hooks: HeapHooks = {}): Promise<void> {
    while (this.nodes.length > values.length) this.removeLast();
    for (let i = 0; i < values.length; i++) {
      if (i < this.nodes.length) this.nodes[i].data = values[i];
      else this.append(values[i]);
    }
    await this.heapify(hooks);
  }

  async setMode(mode: HeapMode, hooks: HeapHooks = {}): Promise<void> {
    this._mode = mode;
    await this.heapify(hooks);
  }

  clear() {
    this.nodes = [];
    this.tree.sync(null, 0);
  }

  private async heapify(hooks: HeapHooks) {
    for (let i = (this.nodes.length >> 1) - 1; i >= 0; i--) {
      await this.siftDown(i, hooks);
    }
  }

  /** True when `a` must sit above `b` in the current mode. */
  private before(a: number, b: number) {
    return this._mode === "min" ? a < b : a > b;
  }

  private swap(i: number, j: number) {
    const tmp = this.nodes[i].data;
    this.nodes[i].data = this.nodes[j].data;
    this.nodes[j].data = tmp;
  }

  private async siftUp(start: number, hooks: HeapHooks) {
    let i = start;
    let swaps = 0;
    while (i > 0) {
      const p = BinaryHeap.parent(i);
      if (hooks.onCompare) await hooks.onCompare(i, p);
      if (!this.before(this.nodes[i].data, this.nodes[p].data)) break;
      this.swap(i, p);
      swaps++;
      if (hooks.onSwap) await hooks.onSwap(i, p);
      i = p;
    }
    return { index: i, swaps };
  }

  private async siftDown(start: number, hooks: HeapHooks) {
    const n = this.nodes.length;
    let i = start;
    while (BinaryHeap.left(i) < n) {
      const l = BinaryHeap.left(i);
      const r = BinaryHeap.right(i);
      let best = l;
      if (r < n) {
        if (hooks.onCompare) await hooks.onCompare(l, r);
        if (this.before(this.nodes[r].data, this.nodes[l].data)) best = r;
      }
      if (hooks.onCompare) await hooks.onCompare(i, best);
      if (!this.before(this.nodes[best].data, this.nodes[i].data)) break;
      this.swap(i, best);
      if (hooks.onSwap) await hooks.onSwap(i, best);
      i = best;
    }
  }

  private append(value: number) {
    const i = this.nodes.length;
    const node = new BinaryTreeNode<number>(value, new Position(0, 0), null);
    this.nodes.push(node);
    if (i === 0) {
      node.isRoot = true;
      node.parent = null;
    } else {
      const parent = this.nodes[BinaryHeap.parent(i)];
      node.isRoot = false;
      node.parent = parent;
      if (i % 2 === 1) {
        parent.leftEdge = new Edge();
        parent.left = node;
      } else {
        parent.rightEdge = new Edge();
        parent.right = node;
      }
    }
    this.syncTree();
  }

  private removeLast() {
    const i = this.nodes.length - 1;
    if (i < 0) return;
    const node = this.nodes.pop();
    if (i > 0 && node) {
      const parent = this.nodes[BinaryHeap.parent(i)];
      if (i % 2 === 1) parent.left = null;
      else parent.right = null;
      node.parent = null;
    }
    this.syncTree();
  }

  private syncTree() {
    this.tree.sync(this.nodes[0] ?? null, this.nodes.length);
  }
}
