import { describe, expect, it } from "vitest";
import LinkedList from "../../classes/LinkedList";
import Node from "../../../_classes/Node";
import LinkedListNode from "../../classes/LinkedListNode";

describe("Testing LinkedList add method", () => {
  it("should initilize with a 0 size", () => {
    const linkedList = new LinkedList();
    expect(linkedList.size).toBe(0);
  });
  it("Should create a head and a tail when linkedList is empty node", () => {
    const linkedList = new LinkedList();
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
    linkedList.add("hello");
    expect(linkedList.head).toBeInstanceOf(Node);
    expect(linkedList.head?.data).toBe("hello");
    expect(linkedList.tail).toBeInstanceOf(Node);
    expect(linkedList.tail?.data).toBe("hello");
  });
  it("Should add a element in the end", () => {
    const linkedList = new LinkedList();
    linkedList.add("hello"); //head and tail
    linkedList.add("world"); //tail
    expect(linkedList.tail?.data).toBe("world");
    expect(linkedList.head?.data).toBe("hello");
    expect(linkedList.head?.next?.data).toBe("world");
    expect(linkedList.tail?.prev?.data).toBe("hello");
    linkedList.add("bye");
    linkedList.add("hola");
    expect(linkedList.head?.next?.data).toBe("world");
    expect(linkedList.head?.next?.next?.data).toBe("bye");
    expect(linkedList.head?.next?.next?.prev?.data).toBe("world");
    expect(linkedList.head?.next?.next?.next?.data).toBe("hola");
    expect(linkedList.head?.next?.next?.next?.prev?.data).toBe("bye");
    expect(linkedList.tail?.data).toBe("hola");
    expect(linkedList.tail?.prev?.data).toBe("bye");
    expect(linkedList.size).toBe(4);
  });
  it("Should add a element at the beginner when a index == 0 is given", () => {
    const linkedList = new LinkedList();
    linkedList.add("hello"); //head and tail
    linkedList.add("world"); //tail
    linkedList.add("bye", 0);
    expect(linkedList.head?.data).toBe("bye");
    expect(linkedList.head?.next?.data).toBe("hello");
    expect(linkedList.head?.next?.prev?.data).toBe("bye");
    expect(() => {
      linkedList.add("hi", -1);
    }).toThrowError(
      `Index: ${-1} doesn't exist on linkedList.size: ${linkedList.size}`
    );
  });

  it("Should add first", () => {
    const linkedList = new LinkedList<number>();
    for (let i = 0; i < 10; i++) {
      linkedList.addFirst(i);
      expect(linkedList.head?.data).toBe(i);
    }
    let head: LinkedListNode<number> | null | undefined = linkedList.head;
    let tail: LinkedListNode<number> | null | undefined = linkedList.tail;
    let j = 9;
    let k = 0;
    while (head) {
      expect(head?.data).toBe(j);
      head = head?.next;
      expect(tail?.data).toBe(k);
      tail = tail?.prev;
      j--;
      k++;
    }
    expect(j).toBe(-1);
    expect(k).toBe(10);
    expect(linkedList.size).toBe(10);
  });
  it("Should add last", () => {
    const linkedList = new LinkedList<number>();
    for (let i = 0; i < 10; i++) {
      linkedList.addLast(i);
      expect(linkedList.tail?.data).toBe(i);
    }
    let head: LinkedListNode<number> | null | undefined = linkedList.head;
    let tail: LinkedListNode<number> | null | undefined = linkedList.tail;
    let j = 9;
    let k = 0;
    while (head) {
      expect(head?.data).toBe(k);
      head = head?.next;
      expect(tail?.data).toBe(j);
      tail = tail?.prev;
      j--;
      k++;
    }
    expect(j).toBe(-1);
    expect(k).toBe(10);
    expect(linkedList.size).toBe(10);
  });

  it("Should add by a given index", () => {
    const linkedList = new LinkedList<number>();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
      expect(linkedList.tail?.data).toBe(i);
    }
    expect(linkedList.tail?.data).toBe(9);
    expect(linkedList.tail?.prev?.data).toBe(8);
    linkedList.add(100, 9);
    expect(linkedList.tail?.prev?.data).toBe(100);
    linkedList.add(101, 11);
    expect(linkedList.tail?.data).toBe(101);
    expect(linkedList.tail?.prev?.data).toBe(9);
    linkedList.add(102, 8);
    expect(linkedList.tail?.prev?.prev?.data).toBe(100);
    expect(linkedList.tail?.prev?.prev?.prev?.data).toBe(8);

    linkedList.add(103, 1);
    linkedList.add(103, 1);
    expect(linkedList.head?.next?.data).toBe(103);
    linkedList.add(104, 2);
    expect(linkedList.head?.next?.next?.data).toBe(104);
    expect(linkedList.size).toBe(16);
    linkedList.add(999, 8);
    let node = linkedList.head;
    for (let i = 0; i < linkedList.size; i++) {
      if (i === 8) {
        expect(node?.data).toBe(999);
        break;
      }
      if (node?.next) node = node?.next;
    }
  });
  it("Should throw error when try to add out of bounds", () => {
    const linkedList = new LinkedList<number>();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
      expect(linkedList.tail?.data).toBe(i);
    }
    expect(() => {
      linkedList.add(11, -1);
    }).toThrowError(
      `Index: ${-1} doesn't exist on linkedList.size: ${linkedList.size}`
    );
    expect(() => {
      linkedList.add(11, linkedList.size + 1);
    }).toThrowError(
      `Index: ${linkedList.size + 1} doesn't exist on linkedList.size: ${
        linkedList.size
      }`
    );
  });
  it("Should return the right side", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
      expect(linkedList.tail?.data).toBe(i);
    }
    expect(linkedList.head?.data).toBe(0);
    expect(linkedList.size).toBe(10);
    expect(linkedList["isTail"](0)).toBeFalsy();
    expect(linkedList["isTail"](1)).toBeFalsy();
    expect(linkedList["isTail"](2)).toBeFalsy();
    expect(linkedList["isTail"](3)).toBeFalsy();
    expect(linkedList["isTail"](4)).toBeFalsy();
    expect(linkedList["isTail"](5)).toBeFalsy();
    expect(linkedList["isTail"](6)).toBeTruthy();
    expect(linkedList["isTail"](7)).toBeTruthy();
    expect(linkedList["isTail"](8)).toBeTruthy();
    expect(linkedList["isTail"](9)).toBeTruthy();
    expect(linkedList["isTail"](10)).toBeTruthy();
  });
});

describe("Testing findNode method in linkedList", () => {
  it("should find nodes", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 1000; i++) {
      linkedList.add(i);
    }
    for (let i = 0; i < 1000; i++) {
      const node = linkedList.findNode(i);
      expect(node?.data).toBe(i);
    }
    for (let i = 999; i >= 0; i--) {
      const node = linkedList.findNode(i);
      expect(node?.data).toBe(i);
    }
  });
});
describe("Testing linkedList get method", () => {
  it("should throw error when index outofbounds", () => {
    const linkedList = new LinkedList<number>();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
    }

    expect(() => {
      linkedList.get(-1);
    }).toThrowError(
      `Index: ${-1} doesn't exist on linkedList.size: ${linkedList.size}`
    );
    expect(() => {
      linkedList.get(linkedList.size);
    }).toThrowError(
      `Index: ${linkedList.size} doesn't exist on linkedList.size: ${linkedList.size}`
    );
    expect(() => {
      linkedList.get(linkedList.size + 1);
    }).toThrowError(
      `Index: ${linkedList.size + 1} doesn't exist on linkedList.size: ${
        linkedList.size
      }`
    );
  });
  it("Should get the first and last position", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
    }
    expect(linkedList.get(0)).toBe(0);
    expect(linkedList.get(linkedList.size - 1)).toBe(9);
  });
  it("Should get by index", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 20; i++) {
      linkedList.add(i);
    }
    for (let i = 0; i < 20; i++) {
      expect(linkedList.get(i)).toBe(i);
    }
  });
});

describe("Testing delete method in linkedList", () => {
  //TODO: implement and test delete method
  it("Should delete head and tail", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
    }
    expect(linkedList.size).toBe(10);
    linkedList.delete(0);
    expect(linkedList.getFirst()).toBe(1);
    expect(linkedList.size).toBe(9);
    for (let i = 1; i <= linkedList.size; i++) {
      expect(linkedList.get(i - 1)).toBe(i);
    }
    expect(linkedList.getLast()).toBe(9);
    linkedList.delete(linkedList.size - 1);
    expect(linkedList.getLast()).toBe(8);
    expect(linkedList.size).toBe(8);
    for (let i = 0; i < 8; i++) {
      linkedList.deleteLast();
    }
    expect(linkedList.size).toBe(0);
  });
  it("Should delete any position", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
    }
    expect(linkedList.head?.next?.data).toBe(1);
    linkedList.delete(1);
    expect(linkedList.head?.next?.data).toBe(2);
    expect(linkedList.size).toBe(9);
    expect(linkedList.head?.next?.next?.data).toBe(3);
    linkedList.delete(2);
    expect(linkedList.head?.next?.next?.data).toBe(4);
    expect(linkedList.tail?.prev?.data).toBe(8);
    linkedList.delete(linkedList.size - 2);
    expect(linkedList.tail?.prev?.data).toBe(7);
    expect(linkedList.tail?.prev?.prev?.data).toBe(6);
    linkedList.delete(linkedList.size - 3);
    expect(linkedList.tail?.prev?.prev?.data).toBe(5);
    expect(linkedList.size).toBe(6);
  });
  it("should delete last", () => {
    const linkedList = new LinkedList();
    for (let i = 0; i < 10; i++) {
      linkedList.add(i);
    }
    expect(linkedList.size).toBe(10);
    for (let i = 0; i < 10; i++) {
      linkedList.deleteLast();
    }
    expect(linkedList.size).toBe(0);
    expect(linkedList.getFirst()).toBe(null);
    expect(linkedList.getLast()).toBe(null);
    expect(linkedList.head).toBe(null);
    expect(linkedList.tail).toBe(null);
  });
});

describe("Should convert to array", () => {
  it("Should init with an array", () => {
    const linkedList = new LinkedList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < 10; i++) {
      expect(linkedList.get(i)).toBe(i);
    }
  });
  it("Should return an array", () => {
    const linkedList = new LinkedList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const arr = linkedList.toArray();
    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr.length).toBe(linkedList.size);
    for (let i = 0; i < linkedList.size; i++) {
      expect(arr[i]).toBe(i);
    }
  });
});
