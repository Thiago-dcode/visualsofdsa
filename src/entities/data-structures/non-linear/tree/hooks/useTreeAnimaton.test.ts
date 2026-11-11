import { renderHook } from "@testing-library/react";
import { AvlTree } from "../../avl-tree/classes/AvlTree";
import { BinarySearchTree } from "../../binary-search-tree/classes/BinarySearchTree";
import BinaryTree from "../_classes/BinaryTree";
import BinaryTreeNode from "../_classes/BinaryTreeNode";
import useTreeAnimaton from "./useTreeAnimaton";

const animateSound = vi.fn();

vi.mock("@/hooks/useSoundAnimation", () => ({
  useSoundAnimation: () => ({ animateSound }),
}));
vi.mock("@/hooks/useAnimation", () => ({
  default: () => ({ focus: vi.fn(), animateEdge: vi.fn(), isAnimationEnabled: true }),
}));
vi.mock("@/lib/animations", () => ({
  animate: vi.fn(async () => {}),
}));
vi.mock("sonner", () => ({ toast: { loading: vi.fn(), dismiss: vi.fn() } }));

const withRef = <T extends { ref: unknown }>(node: T) => {
  node.ref = document.createElement("div");
  return node;
};

describe("useTreeAnimaton getMinMax (via sound)", () => {
  beforeEach(() => {
    animateSound.mockClear();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("AC-SH-4: BST still passes min and max to the sound", async () => {
    const bst = new BinarySearchTree<number>();
    for (const v of [50, 30, 70, 10, 90]) await bst.insert(v);
    const { result } = renderHook(() => useTreeAnimaton<number, BinaryTreeNode<number>>(bst, 1));
    await result.current.onTraversal(withRef(bst.root as NonNullable<typeof bst.root>));
    expect(animateSound).toHaveBeenCalledWith(50, 10, 90);
  });

  it("AC-SH-4: any isSortable tree (AvlTree) passes its min and max", async () => {
    const avl = new AvlTree<number>();
    for (const v of [50, 30, 70, 10, 90, 5]) await avl.insert(v);
    const { result } = renderHook(() => useTreeAnimaton<number, BinaryTreeNode<number>>(avl, 1));
    await result.current.onTraversal(withRef(avl.root as NonNullable<typeof avl.root>));
    expect(animateSound).toHaveBeenCalledTimes(1);
    const [value, min, max] = animateSound.mock.calls[0];
    expect(value).toBe(avl.root?.data);
    expect(min).toBe(5);
    expect(max).toBe(90);
  });

  it("AC-SH-4: a non sortable tree falls back to {0,0}", async () => {
    // BinaryTree has no min/max, so isSortable() is false.
    const tree = new BinaryTree<number>();
    const node = withRef(new BinaryTreeNode<number>(4));
    // biome-ignore lint/suspicious/noExplicitAny: seeding the root of a bare tree for the test
    (tree as any)._root = node;
    const { result } = renderHook(() => useTreeAnimaton<number, BinaryTreeNode<number>>(tree, 1));
    await result.current.onTraversal(node);
    expect(animateSound).toHaveBeenCalledWith(4, 0, 0);
  });
});
