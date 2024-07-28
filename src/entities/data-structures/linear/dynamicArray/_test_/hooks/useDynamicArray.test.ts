import { waitFor } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import useDynamicArray from "../../hooks/useDynamicArray";
import Node from "../../../_classes/Node";

describe("UseDynamicArray HOOK", () => {
  it("Should create an array of null in the first render", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    if (result.current.array) {
      for (let i = 0; i < result.current.capacity; i++) {
        const element = result.current.array[i];
        expect(element).toBeNull();
      }
    }
  });

  it("Should write first", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.write("hello", 0);
    });

    expect(result.current.size).toBe(1);
    expect(result.current.error).toBeNull();
    expect(Array.isArray(result.current.array)).toBeTruthy();
    if (result.current.array) {
      expect(result.current.array[0]).toBeInstanceOf(Node);
      if (result.current.array[0]) {
        expect(result.current.array[0].data).toBe("hello");
      }
    }
    await act(async () => {
      await result.current.write("bye", 0);
    });
    expect(result.current.size).toBe(1);
    expect(result.current.error).toBeNull();
    expect(Array.isArray(result.current.array)).toBeTruthy();
    if (result.current.array) {
      expect(result.current.array[0]).toBeInstanceOf(Node);
      if (result.current.array[0]) {
        expect(result.current.array[0].data).toBe("bye");
      }
    }
  });
  it("Should write all capacity and array should expand", async () => {
    const { result } = renderHook(useDynamicArray);
    const { array, capacity, size, error, write } = result.current;
    expect(array?.length).toBe(capacity);
    expect(size).toBe(0);
    expect(capacity).toBe(10);
    expect(error).toBeNull();
    await act(async () => {
      await result.current.write("helsdsdlo-" + 0, 0);
    });
    await act(async () => {
      await result.current.write("bye" + 0, 0);
    });
    for (let i = 0; i < capacity; i++) {
      await act(async () => {
        await result.current.write("hello-" + i, i);
      });
    }
    await act(async () => {
      await result.current.write("previousOfLastNode", result.current.size - 1);
    });
    await act(async () => {
      await result.current.write("lastNode", result.current.size);
    });
    expect(result.current.size).toBe(11);
    expect(result.current.error).toBeNull();
    expect(result.current.capacity).toBe(20);
    expect(result.current.array?.length).toBe(result.current.capacity);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];

        if (i < result.current.size) {
          expect(element).toBeInstanceOf(Node);
          if (element) {
            if (i === 9) {
              expect(element.data).toBe("previousOfLastNode");
            } else if (i === result.current.size - 1) {
              expect(element.data).toBe("lastNode");
            } else {
              expect(element.data).toBe("hello-" + i);
            }
          }
        } else {
          expect(element).toBeNull();
        }
      }
    }
  });
  it("Extend capacity", async () => {
    const { result } = renderHook(useDynamicArray);
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        await result.current.write("hello-" + i, i);
      });
      if (i === 9) {
        expect(result.current.capacity).toBe(20);
      }
      if (i === 19) {
        expect(result.current.capacity).toBe(40);
      }
      if (i === 39) {
        expect(result.current.capacity).toBe(80);
      }
      if (i === 79) {
        expect(result.current.capacity).toBe(160);
      }
    }
    expect(result.current.size).toBe(100);
    expect(result.current.array?.length).toBe(result.current.capacity);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];

        if (i < result.current.size) {
          expect(element).toBeInstanceOf(Node);
          if (element) {
            expect(element.data).toBe("hello-" + i);
          }
        } else {
          expect(element).toBeNull();
        }
      }
    }
  });
  it("Should set error and not write when attempt to write an out of the bound position", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    expect(result.current.error).toBeNull();
    await act(async () => {
      await result.current.write(1, 1);
    });
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.size).toBe(0);
    expect(result.current.capacity).toBe(10);
    expect(result.current.error).toBeTruthy();
    if (result.current.error) {
      expect(result.current.error.name).toBe("IndexOutOfTheBoundException");
      expect(result.current.error.description).toBe(
        "Index 1 out of bounds for length 0"
      );
    }
    await act(async () => {
      await result.current.write("hello", 0);
    });

    expect(result.current.capacity).toBe(10);
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.write("hello", i);
      });
    }
    for (let i = result.current.size + 1; i < 100; i++) {
      await act(async () => {
        await result.current.write("hello", i);
      });
      expect(result.current.error).toBeTruthy();
      if (result.current.error) {
        expect(result.current.error.name).toBe("IndexOutOfTheBoundException");
        expect(result.current.error.description).toBe(
          `Index ${i} out of bounds for length ${result.current.size}`
        );
      }
    }
    expect(result.current.capacity).toBe(20);
    expect(result.current.size).toBe(10);
  });
});
