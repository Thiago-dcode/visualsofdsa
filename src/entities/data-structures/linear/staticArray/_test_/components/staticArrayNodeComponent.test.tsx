import { render, screen } from "@testing-library/react";

import StaticArrayNodeComponent from "../../components/StaticArrayNodeComponent";
import Node from "../../../_classes/Node";
import { Primitive } from "@/types";
import Position from "../../../../../../lib/classes/Position";
const nodeElements = (array: Node<Primitive>[] | null) => {

  return (
    <>
      {array && array.map((node, i) => {

        return (
          <StaticArrayNodeComponent isLastNode={false} node={node} setAnimationRunning={() => { }} key={i + ''} />
        )
      })}

    </>
  )
}

describe("StaticArrayNodeComponent", () => {
  it("Should Render a single node and set ref", async () => {
    const node: Node<Primitive> = new Node(1, new Position(0, 0));
    expect(node.ref).toBeNull()
    const ui = render(<StaticArrayNodeComponent isLastNode={false} node={node} setAnimationRunning={() => { }} />)
    expect(node.ref).toBeTruthy()
    if (node.ref) {
      expect(node.ref.textContent).toBe(node.data + '')
      expect(node.ref.id).toBe('staticArray-node-' + node.id)
    }
    const paragraph = screen.getByRole('paragraph')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph.parentElement).toBeInTheDocument()
    expect(paragraph.parentElement?.id).toBe('staticArray-node-' + node.id)
    expect(paragraph.textContent).toBe(node.data + '')
  });
  it("Should Render many nodes and set ref", async () => {
    const nodes: Node<Primitive>[] = [];
    for (let i = 0; i < 20; i++) {
      nodes[i] = new Node(1, new Position(0, 0));
      nodes[i].data = i;
      expect(nodes[i].ref).toBeNull()
    }
    const ui = render(nodeElements(nodes))
    const paragraphs = screen.getAllByRole('paragraph')
    expect(paragraphs.length).toBe(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      expect(paragraphs[i]).toBeInTheDocument()
      expect(paragraphs[i].textContent).toBe(nodes[i].data + '')
      expect(nodes[i].ref).toBeInstanceOf(HTMLElement)
    }

  });
});
