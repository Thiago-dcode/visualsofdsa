import { Primitive } from "@/types";
import Tree from "./Tree";
import TreeNode from "./TreeNode";
import Position from "@/lib/classes/position/Position";

export default class TreeLayout<T extends Primitive, K extends TreeNode<T>> {
  private _tree: Tree<T, K>;
  private _lvlHeight: number;
  private _treeWidth: number;
  private _minSeparation: number = 2; // Minimum separation between nodes

  constructor(tree: Tree<T, K>, lvlHeight: number, treeWidth: number) {
    this._tree = tree;
    this._lvlHeight = lvlHeight;
    this._treeWidth = treeWidth;
  }

  public async layout(): Promise<void> {
    if (!this._tree.root) return;

    //TODO: set root initial position

    this.firstWalk(this._tree.root);
    this.secondWalk(this._tree.root);
    this.thirdWalk(this._tree.root, 0);
  }

  private firstWalk(node: TreeNode<T>, depth: number = 0) {
    // Initialize current node
    node.position.x = -1;
    node.position.y = depth;
    node.mod = 0;

    // Process all children at depth + 1
    for (const child of node.children) {
      this.firstWalk(child, depth + 1);
    }

    this.calculateInitialX(node);

    if (node.children.length > 0 && !node.isLeftmost) {
      this.checkForConflicts(node);
    }
  }

  private calculateInitialX(node: TreeNode<T>, currentIndex: number = 0) {
    if (node.isLeaf) {
      if (!node.isLeftmost) {
        node.position.x = node.previousSibling
          ? node.previousSibling.position.x +
            this._tree.nodeWidth +
            this._minSeparation
          : 0;
      } else {
        node.position.x = 0;
      }
    } else if (node.children.length === 1) {
      if (node.isLeftmost) {
        node.position.x = node.children[0].position.x;
      } else {
        node.position.x = node.previousSibling
          ? node.previousSibling.position.x +
            this._tree.nodeWidth +
            this._minSeparation
          : 0;
      }
    } else {
      const leftmostChild = node.leftmostChild;
      const rightmostChild = node.rightmostChild;
      const mid =
        leftmostChild && rightmostChild
          ? (leftmostChild.position.x + rightmostChild.position.x) / 2
          : node.position.x;
      if (node.isLeftmost) {
        node.position.x = mid;
      } else {
        node.position.x = node.previousSibling
          ? node.previousSibling.position.x +
            this._tree.nodeWidth +
            this._minSeparation
          : 0;
        node.mod = node.position.x - mid;
      }
    }
  }

  private checkForConflicts(node: TreeNode<T>): void {
    const minDistance = this._treeWidth + this._tree.nodeWidth;
    let shiftValue = 0;

    const nodeContour = new Map<number, number>();
    this.getLeftContour(node, 0, nodeContour);

    let sibling = node.leftmostSibling;
    while (sibling && sibling !== node) {
      const siblingContour = new Map<number, number>();
      this.getRightContour(sibling, 0, siblingContour);

      // Get max level from both contours
      const maxLevel = Math.min(
        Math.max(...Array.from(siblingContour.keys())),
        Math.max(...Array.from(nodeContour.keys()))
      );

      // Start from node's level + 1
      for (let level = node.position.y + 1; level <= maxLevel; level++) {
        const nodeValue = nodeContour.get(level);
        const siblingValue = siblingContour.get(level);

        if (nodeValue !== undefined && siblingValue !== undefined) {
          const distance = nodeValue - siblingValue;
          if (distance + shiftValue < minDistance) {
            shiftValue = minDistance - distance;
          }
        }
      }

      if (shiftValue > 0) {
        node.position.x += shiftValue;
        node.mod += shiftValue;

        this.centerNodesBetween(node, sibling);

        shiftValue = 0;
      }

      sibling = sibling.nextSibling;
    }
  }
  private centerNodesBetween(node: TreeNode<T>, sibling: TreeNode<T>): void {
    if (!node.parent) return;
    const leftIndex = node.parent.children.indexOf(sibling);
    const rightIndex = node.parent.children.indexOf(node);

    const numNodesBetween = rightIndex - leftIndex - 1;

    if (numNodesBetween > 0) {
      const distanceBetweenNodes =
        (node.position.x - sibling.position.x) / (numNodesBetween + 1);

      let count = 1;
      for (let i = leftIndex + 1; i < rightIndex; i++) {
        const middleNode = node.parent.children[i];
        const desiredX = sibling.position.x + distanceBetweenNodes * count;
        const offset = desiredX - middleNode.position.x;
        middleNode.position.x += offset;
        middleNode.mod += offset;

        count++;
      }

      this.checkForConflicts(node);
    }
  }

  private secondWalk(node: TreeNode<T>) {
    const nodeCountour = new Map<number, number>();
    this.getLeftContour(node, 0, nodeCountour);

    let shiftAmount = 0;
    for (const y of Array.from(nodeCountour.keys())) {
      const value = nodeCountour.get(y);
      if (value !== undefined && value + shiftAmount < 0) {
        shiftAmount = value * -1;
      }
    }

    if (shiftAmount > 0) {
      node.position.x += shiftAmount;
      node.mod += shiftAmount;
    }
  }
  private thirdWalk(node: TreeNode<T>, modSum: number) {
    node.position.x += modSum;
    modSum += node.mod;
    for (const child of node.children) {
      this.thirdWalk(child, modSum);
    }
  }
  private getLeftContour(
    node: TreeNode<T>,
    modSum: number,
    values: Map<number, number>
  ): void {
    const value = values.get(node.position.y);
    if (!value) {
      values.set(node.position.y, node.position.x + modSum);
    } else {
      values.set(node.position.y, Math.min(value, node.position.x + modSum));
    }

    modSum += node.mod;

    for (const child of node.children) {
      this.getLeftContour(child, modSum, values);
    }
  }

  private getRightContour(
    node: TreeNode<T>,
    modSum: number,
    values: Map<number, number>
  ): void {
    const value = values.get(node.position.y);
    if (!value) {
      values.set(node.position.y, node.position.x + modSum);
    } else {
      values.set(node.position.y, Math.max(value, node.position.x + modSum));
    }

    modSum += node.mod;

    for (const child of node.children) {
      this.getRightContour(child, modSum, values);
    }
  }
  get tree(): Tree<T, K> {
    return this._tree;
  }

  get treeWidth(): number {
    return this._treeWidth;
  }
  set treeWidth(width: number) {
    this._treeWidth = width;
  }
  get lvlHeight(): number {
    return this._lvlHeight;
  }
  set lvlHeight(height: number) {
    this._lvlHeight = height;
  }

  get minSeparation(): number {
    return this._minSeparation;
  }

  set minSeparation(separation: number) {
    this._minSeparation = separation;
  }
}
