import { describe, expect, it } from "vitest";
import Queue from "../../classes/Queue";

describe("Testing Queue class", () => {
  it("Should initialize with a empty queue", () => {
    const queue = new Queue();
    expect(queue.size).toBe(0);
  });

  it("Should initialze with an array of StackNode", () => {
    const data: number[] = [];
    for (let i = 0; i < 10; i++) {
      data.push(i);
    }
    const queue = new Queue(data);
    for (let i = 0; i < data.length; i++) {
      expect(i).toBe(queue.toNodeArray[i].data);
    }
  });
  it("Should enqueue ", () => {
    const queue = new Queue<number>();
    queue.maxSize = 100;
    for (let i = 0; i < queue.maxSize; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < queue.toArray.length; i++) {
      expect(i).toBe(queue.toNodeArray[i].data);
    }
  });
  it("Should dequeue ", () => {
    const queue = new Queue<number>();
    queue.maxSize = 100;

    for (let i = 0; i < queue.maxSize; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < queue.maxSize; i++) {
      expect(queue.toArray[i]).toBe(i);
    }
    queue.dequeue();
    expect(queue.toArray[0]).toBe(1);
    queue.dequeue();
    expect(queue.toArray[0]).toBe(2);
    expect(queue.toArray.length).toBe(98);

    expect(queue.size).toBe(98);
  });
  it("Should dequeue all ", () => {
    const queue = new Queue<number>();
    queue.maxSize = 100;

    for (let i = 0; i < queue.maxSize; i++) {
      queue.enqueue(i);
    }
    for (let i = 0; i < queue.maxSize; i++) {
      expect(queue.dequeue()).toBe(i);
    }
    expect(queue.size).toBe(0);
    expect(queue.peek()).toBeNull();
    expect(queue.toNodeArray.length).toBe(0);
    expect(queue.toNodeArray[0]).toBeFalsy();
    expect(queue.dequeue()).toBe(null);
  });
  it("Should peek ", () => {
    const queue = new Queue<number>();
    queue.maxSize = 100;
    for (let i = 0; i < queue.maxSize; i++) {
      queue.enqueue(i);
    }
    expect(queue.peek()).toBe(0);
    expect(queue.peekNode()?.data).toBe(0);
    queue.dequeue();
    expect(queue.peek()).toBe(1);
    expect(queue.peekNode()?.data).toBe(1);
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();
    queue.dequeue();
    expect(queue.peek()).toBe(5);
    expect(queue.peekNode()?.data).toBe(5);
  });
});
