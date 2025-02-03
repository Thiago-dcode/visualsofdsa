import { waitFor } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import useDynamicArray from "../../hooks/useDynamicArray";
import Node from "../../../_classes/Node";
import { DynamicArrayNode } from "../../class/DynamicArrayNode";

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
  it("Should extend capacity", async () => {
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
  it("Should reset array after cleanUp function", async () => {
    const { result } = renderHook(useDynamicArray);
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        await result.current.write("hello-" + i, i);
      });
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
    act(() => {
      result.current.cleanUp();
    });
    expect(result.current.size).toBe(0);
    expect(result.current.capacity).toBe(10);
    expect(result.current.array?.length).toBe(result.current.capacity);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeNull();
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

  it("Should insert in the last position", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);

    await act(async () => {
      await result.current.insert("hello", 0);
    });
    expect(result.current.size).toBe(1);

    for (let i = result.current.size; i < 10; i++) {
      await act(async () => {
        await result.current.insert("hello-" + i, i);
      });
    }
    expect(result.current.size).toBe(10);
  });
  it("Should throw error when insert out of the bound", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    await act(async () => {
      await result.current.insert("hello", 1);
    });
    expect(result.current.size).toBe(0);

    expect(result.current.error).toBeTruthy();
  });
  it("Should insert", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.insert("hello-" + i, i);
      });
    }
    expect(result.current.size).toBe(10);
    await act(async () => {
      await result.current.insert("hello-insert", 0);
    });
    expect(result.current.size).toBe(11);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];

        if (i < result.current.size) {
          if (element) {
            expect(element instanceof DynamicArrayNode).toBe(true);
            if (i === 0) {
              expect(element.data).toBe("hello-insert");
              if (element instanceof DynamicArrayNode) {
                expect(element.isLastInserted).toBeTruthy();
              }
            } else {
              expect(element.data).toBe("hello-" + (i - 1));
              if (element instanceof DynamicArrayNode) {
                expect(element.isLastInserted).toBeFalsy();
              }
            }
          }
          continue;
        }
        expect(element).toBeNull();
      }
    }

    await act(async () => {
      await result.current.insert("hello-insert-3", 3);
    });
    expect(result.current.size).toBe(12);
    if (result.current.array) {
      expect(result.current.array[3]).toBeInstanceOf(DynamicArrayNode);
      if (result.current.array[3]) {
        expect(result.current.array[3].data).toBe("hello-insert-3");
      }
    }
    expect(result.current.size).toBe(12);
  });

  it("should insert in the first position", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.insert("hello-" + i, i);
      });
    }

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await result.current.insert("hello-insert-" + i, 0);
      });
    }
    expect(result.current.size).toBe(20);
    expect(result.current.capacity).toBe(40);
    let j = 9;
    if (result.current.array) {
      for (let i = 0; i < result.current.capacity; i++) {
        const element = result.current.array[i];

        if (
          i < result.current.size &&
          element &&
          element instanceof DynamicArrayNode
        ) {
          expect(element).toBeInstanceOf(DynamicArrayNode);
          if (i < 10) {
            if (j === 9) {
              expect(element.isLastInserted).toBe(true);
            } else {
              expect(element.isLastInserted).toBe(false);
            }
            expect(element.data).toBe("hello-insert-" + j);
            j--;
          } else {
            expect(element.data).toBe("hello-" + (i - 10));
            expect(element.isLastInserted).toBe(false);
          }
        }
      }
    }
  });
  it("should pop", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        await result.current.pop();
      });
    }
    expect(10).toBe(result.current.capacity);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);
    for (let i = 0; i < 100; i++) {
      await act(async () => {
        await result.current.push("hello-" + i);
      });
    }
    expect(result.current.size).toBe(100);
    if (result.current.array) {
      expect(result.current.array[result.current.size - 1]).toBeInstanceOf(
        DynamicArrayNode
      );
    }
    await act(async () => {
      await result.current.pop();
    });
    if (result.current.array) {
      expect(result.current.array[99]).toBeNull();
    }
    expect(result.current.size).toBe(99);
    if (result.current.array) {
      expect(result.current.array[result.current.size - 1]).toBeInstanceOf(
        DynamicArrayNode
      );
    }
    let size = result.current.size;
    for (let i = 0; i < size; i++) {
      await act(async () => {
        await result.current.pop();
      });
    }
    expect(result.current.size).toBe(0);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeNull();
      }
    }
  });

  it('Should push',async ()=>{
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0); 
    for (let i = 0; i < 10; i++) {
      act( () => {
        result.current.push("hello-" + i);
      });
    }
    expect(result.current.size).toBe(10);

    if(result.current.array){

      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];

        if(i <result.current.size){

          expect(element).toBeInstanceOf(DynamicArrayNode);
        }
        
      }
    }
  })
  it("should delete", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);

    for (let i = 0; i < 100; i++) {
      act( () => {
        result.current.push("hello-" + i);
      });
    }
    expect(result.current.size).toBe(100);
    if (result.current.array) {
      expect(result.current.array[99]).toBeInstanceOf(DynamicArrayNode);
    }
    const size = result.current.size;
    for (let i = size - 1; i >= 0; i--) {
      await act(async () => {
        //should pop
        await result.current.delete(result.current.size - 1);
      });
      expect(result.current.size).toBe(i);
      if (result.current.array) {
        expect(result.current.array[i]).toBe(null);
      }
    }
    for (let i = 0; i < 100; i++) {
      act( () => {
        result.current.push("hello-" + i);
      });
    }
    expect(result.current.size).toBe(100);
    if (result.current.array && result.current.array[0]) {
      expect(result.current.array[0].data).toBe("hello-0");
      expect(result.current.array[0]).toBeInstanceOf(DynamicArrayNode);
    }
    await act(async () => {
      await result.current.delete(0);
    });
    expect(result.current.size).toBe(99);
    if (result.current.array && result.current.array[0]) {
      expect(result.current.array[0].data).toBe("hello-1");
      expect(result.current.array[99]).toBeNull();
    }
  });
  it("Should fill", async () => {
    const { result } = renderHook(useDynamicArray);
    expect(result.current.array).toBeInstanceOf(Array);
    expect(result.current.array?.length).toBe(result.current.capacity);
    expect(result.current.size).toBe(0);

    await act(async () => {
      result.current.fill(25);
    });
    expect(result.current.error).toBe(null);
    expect(result.current.size).toBe(25);
    expect(result.current.error).toBe(null);
    expect(result.current.array).toBeInstanceOf(Array);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        if (i < result.current.size) {
          expect(element).toBeInstanceOf(DynamicArrayNode);
        }
      }
    }
  });
});
