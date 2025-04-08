import { describe, expect, it } from "vitest";
import Stack from "../../classes/Stack";
describe("Stack class test", () => {
  it("Should initialize with a empty stack", () => {
    const stack = new Stack();
    expect(stack.size).toBe(0);
  });
  it("Should initialze with an array of StackNode", () => {
    const data: number[] = [];
    for (let i = 0; i < 10; i++) {
      data.push(i);
    }
    const stack = new Stack(data);
    for (let i = 0; i < data.length; i++) {
      expect(i).toBe(stack.toArray[i]);
    }
  });
  it("Should add", async () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    for (let i = 0; i < stack.maxSize; i++) { 
      await stack.add(i);
    }
    for (let i = 0; i < stack.toArray.length; i++) {
      expect(i).toBe(stack.toArray[i]);
    }
  });

  it("Should remove", async () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    for (let i = 0; i < stack.maxSize; i++) {
      await stack.add(i);
    }

    expect(stack.size).toBe(stack.maxSize);

    for (let i = stack.maxSize - 1; i >= 0; i--) {
      const node = await stack.remove()
      expect(node?.data).toBe(i);
    }

    expect(stack.size).toBe(0);
  });
  it("Should peek", async () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    expect(stack.peek()).toBe(null);

    for (let i = 0; i < stack.maxSize; i++) {
      await stack.add(i);
    }

    expect(stack.peek()).toBe(stack.maxSize - 1);
  });
});
