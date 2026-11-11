import { render, screen } from "@testing-library/react";
import NodeShape from "@/lib/classes/NodeShape";
import BinaryTreeNode from "../../_classes/BinaryTreeNode";
import TreeNodeComponent from "./treeNodeComponent";

vi.mock("@/hooks/useAnimation", () => ({
  default: () => ({
    focus: vi.fn(),
    animateEdge: vi.fn(),
    setProperty: vi.fn(),
    isAnimationEnabled: true,
  }),
}));

class Shape extends NodeShape {}

describe("TreeNodeComponent renderBadge", () => {
  it("AC-SH-3: renders the badge output when renderBadge is passed", () => {
    const node = new BinaryTreeNode<number>(20);
    render(
      <TreeNodeComponent
        node={node}
        nodeShape={new Shape()}
        renderBadge={(n) => <span>{`bf ${n.data}`}</span>}
      />,
    );
    expect(screen.getByText("bf 20")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
  });

  it("AC-SH-3: renders no extra element when renderBadge is absent (BST DOM unchanged)", () => {
    const node = new BinaryTreeNode<number>(20);
    const withBadge = render(
      <TreeNodeComponent node={node} nodeShape={new Shape()} renderBadge={() => <b>badge</b>} />,
    );
    const badgeChildCount = withBadge.container.childElementCount;
    withBadge.unmount();

    const { container } = render(<TreeNodeComponent node={node} nodeShape={new Shape()} />);
    expect(container.childElementCount).toBe(badgeChildCount - 1);
    expect(container.querySelector("span.pointer-events-none")).toBeNull();
    expect(container.querySelectorAll("button")).toHaveLength(1);
    expect(screen.queryByText("badge")).toBeNull();
  });

  it("AC-SH-3: the badge does not change the node button content or ref wiring", () => {
    const node = new BinaryTreeNode<number>(7);
    render(<TreeNodeComponent node={node} nodeShape={new Shape()} renderBadge={() => "bf 0"} />);
    expect(node.ref).toBeInstanceOf(HTMLButtonElement);
    expect(screen.getByRole("button")).toHaveTextContent("7");
    expect(screen.getByText("bf 0")).toBeInTheDocument();
  });
});
