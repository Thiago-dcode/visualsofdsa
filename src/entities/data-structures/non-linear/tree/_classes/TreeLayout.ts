import { Primitive } from "@/types";
import Tree from "./Tree";
import TreeNode from "./TreeNode";

export default class TreeLayout<T extends Primitive, K extends TreeNode<T>> {
  private _tree: Tree<T, K>;
  private _lvlHeight: number;
  private _treeWidth: number;
  private _minSeparation: number;
  private _paddingX: number;
  private _maxDepth: number;

  constructor(
    tree: Tree<T, K>, 
    lvlHeight: number = 100,  
    paddingX: number = 10,
    minSeparation: number = tree.nodeWidth / 2
  ) {
    this._tree = tree;
    this._lvlHeight = lvlHeight;
    this._treeWidth = 0;
    this._minSeparation = minSeparation;
    this._paddingX = paddingX;
    this._maxDepth = 0;
  }

  // Public methods
  public async layout(): Promise<void> {
    if (!this._tree.root) return;

    //TODO: set root initial position
    this.firstWalk(this._tree.root);
    this.secondWalk(this._tree.root);
    this.thirdWalk(this._tree.root, 0);
    this.setTreeWidth();
  }

  public centerTree(width: number) {
    if (!(this._tree.root && width > 0)) return;
    const center = width / 2 - this._tree.root.position.x;
    const shift = center > 0 ? center + this._paddingX : this._paddingX;
    this._centerTree(this._tree.root, shift);
  }

  // Private tree walk methods
  private firstWalk(node: TreeNode<T>, depth: number = 0) {
    // Initialize current node
    node.position.x = -1;
    node.position.y = depth;
    node.mod = 0;
    if (depth > this._maxDepth) {
      this._maxDepth = depth;
    }

    // Process all children at depth + 1
    for (const child of node.children) {
      this.firstWalk(child, depth + 1);
    }

    this.calculateInitialX(node);

    if (node.children.length > 0 && !node.isLeftmost) {
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

  // Position calculation methods
  private calculateInitialX(node: TreeNode<T>) {
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
    const minDistance = this._tree.nodeWidth * 2;
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

  // Helper methods
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

  private _centerTree(node: TreeNode<T>, shift: number) {
    node.position.x += shift;
    for (const child of node.children) {
      this._centerTree(child, shift);
    }
  }

  private setTreeWidth() {
    if (!this._tree.root) return;
    const leftMostX = this._tree.leftMostNode(this._tree.root)!.position.x;
    const rightMostX = this._tree.rightMostNode(this._tree.root)!.position.x;
    const maxWidth = rightMostX - leftMostX;
    this._treeWidth = maxWidth + this._tree.nodeWidth;
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

  // Getters and setters
  get paddingX(): number {
    return this._paddingX;
  }

  set paddingX(padding: number) {
    this._paddingX = padding;
  }

  get tree(): Tree<T, K> {
    return this._tree;
  }

  get treeWidth(): number {
    return this._treeWidth + (this._paddingX ? this._paddingX * 2 : 0);
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

  get maxDepth(): number {
    return this._maxDepth;
  }

  get minSeparation(): number {
    return this._minSeparation;
  }

  set minSeparation(separation: number) {
    this._minSeparation = separation;
  }
}
