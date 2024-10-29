import { act, renderHook } from "@testing-library/react";
import UseLinkedList from "../../hooks/UseLinkedList";
import LinkedList from "../../classes/LinkedList";
import LinkedListNode from "../../classes/LinkedListNode";

describe("Testing UseLinkedList", () => {
  it("Should add", async () => {
    const { result } = renderHook(UseLinkedList);
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    expect(result.current.arrayLs.length).toBe(1000);
    for (let i = 0; i < result.current.arrayLs.length; i++) {
      const element = result.current.arrayLs[i];
      expect(element).toBeInstanceOf(LinkedListNode);
      expect(element.data).toBe("data-" + i);
    }
  });
  it("Should get", async () => {
    const { result } = renderHook(UseLinkedList);
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    for (let i = 0; i < result.current.arrayLs.length; i++) {
      const element = result.current.arrayLs[i];
      const _element = await result.current.get(i);
      expect(element).toBe(_element);
      
    }
  });
  it("Should delete", async () => {
    const { result } = renderHook(UseLinkedList);
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    const array = result.current.arrayLs;
    for (let i = array.length - 1; i >= 0; i--) {
      await act(async () => {
        await result.current.del(i);
      });
      const element = array[i];
      expect(element).toBeInstanceOf(LinkedListNode);
      expect(element.data).toBe("data-" + i);
      expect(result.current.arrayLs.length).toBe(i);
    }
  });
});

describe("Testing UseLinkedList DOUBLY", () => {
  it("Should add", async () => {
    const { result } = renderHook(UseLinkedList,{
      initialProps:true
    });
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    expect(result.current.arrayLs.length).toBe(1000);
    for (let i = 0; i < result.current.arrayLs.length; i++) {
      const element = result.current.arrayLs[i];
      expect(element).toBeInstanceOf(LinkedListNode);
      expect(element.data).toBe("data-" + i);
    }
  });
  it("Should get", async () => {
    const { result } = renderHook(UseLinkedList,{
      initialProps:true
    }); 
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    for (let i = 0; i < result.current.arrayLs.length; i++) {
      const element = result.current.arrayLs[i];
      const _element = await result.current.get(i);
      expect(element).toBe(_element);
      
    }
  });
  it("Should delete", async () => {
    const { result } = renderHook(UseLinkedList,{
      initialProps:true
    });
    expect(result.current.arrayLs).toBeInstanceOf(Array);
    for (let i = 0; i < 1000; i++) {
      await act(async () => {
        await result.current.add("data-" + i, i);
      });
    }
    const array = result.current.arrayLs;
    for (let i = array.length - 1; i >= 0; i--) {
      await act(async () => {
        await result.current.del(i);
      });
      const element = array[i];
      expect(element).toBeInstanceOf(LinkedListNode);
      expect(element.data).toBe("data-" + i);
      expect(result.current.arrayLs.length).toBe(i);
    }
  });
});
