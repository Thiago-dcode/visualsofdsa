import { describe, expect, it } from "vitest";

import StackNode from "../../classes/StackNode";
import Position from "../../../../../../lib/classes/position/Position";
describe("StackNode class test", () => {
  it("Should accept numbers", () => {
    const node = new StackNode<number>(50, new Position(0, 0));
    expect(node.data).toBe(50);
    node.data = 75;
    expect(node.data).toBe(75);
  });
  it("Should accept Strings", () => {
    const node = new StackNode<string>("hello", new Position(0, 0));
    expect(node.data).toBe("hello");
    node.data = "bye";
    expect(node.data).toBe("bye");
  });
});
