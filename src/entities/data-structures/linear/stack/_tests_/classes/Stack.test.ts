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
  it("Should push", () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    for (let i = 0; i < stack.maxSize; i++) {
      stack.push(i);
    }
    for (let i = 0; i < stack.toArray.length; i++) {
      expect(i).toBe(stack.toArray[i]);
    }
  });

  it("Should pop", () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    for (let i = 0; i < stack.maxSize; i++) {
      stack.push(i);
    }

    expect(stack.size).toBe(stack.maxSize);

    for (let i = stack.maxSize - 1; i >= 0; i--) {
      expect(stack.pop()).toBe(i);
    }

    expect(stack.size).toBe(0);
  });
  it("Should peek", () => {
    const stack = new Stack<number>();
    stack.maxSize = 100;
    expect(stack.peek()).toBe(null);

    for (let i = 0; i < stack.maxSize; i++) {
      stack.push(i);
    }

    expect(stack.peek()).toBe(stack.maxSize - 1);
  });
});
