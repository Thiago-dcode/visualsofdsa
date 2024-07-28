import { act, renderHook } from "@testing-library/react";
import useStaticArray from "../../hooks/useStaticArray";
import Node from "../../../_classes/Node";

describe("Testin custom hook useStaticArray", async () => {
  it("Should create an array of nodes", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10)
    })
    expect(result.current.array?.length).toBe(10);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeInstanceOf(Node)
        if (element) expect(element.data).toBeNull();

      }
    }
  });
  it("Should create an array of null", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10, false)
    })
    expect(result.current.array?.length).toBe(10);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeNull()

      }
    }
  });
  it("Should write", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10)
    })
    expect(result.current.array?.length).toBe(10);
    await
      act(async () => {
        expect(result.current.array).toBeTruthy();
        if (result.current.array?.length) {
          for (let index = 0; index < result.current.array.length; index++) {
            const element = result.current.array[index];
            expect(element).toBeInstanceOf(Node)
            if (element) expect(element.data).toBeNull();
            await result.current.write(index, index);
          }
        }
      })

    expect(result.current.array).toBeTruthy();
    if (result.current.array?.length) {
      for (let index = 0; index < result.current.array.length; index++) {
        const element = result.current.array[index];
        expect(element).toBeInstanceOf(Node)
        if (element) expect(element.data).toBe(index);


      }
    }
    await
      act(async () => {
        expect(result.current.array).toBeTruthy();
        if (result.current.array?.length) {
          for (let index = 0; index < result.current.array.length; index++) {
            const element = result.current.array[index];
            await result.current.write(null, index);
          }
        }
      })

    if (result.current.array?.length) {
      for (let index = 0; index < result.current.array.length; index++) {
        const element = result.current.array[index];
        expect(element).toBeInstanceOf(Node)
        if (element) expect(element.data).toBeNull();
      }
    }
  });


  it("Should set error", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.error).toBe(null);
    act(() => {
      result.current.create(result.current.maxSize + 1);
    });
    if (result.current.error) {
      expect(result.current.error.name).toBe(`IndexOutOfTheBoundException`);
      expect(result.current.error.description).toBe(
        `A Stack overflow error has ocurred. Array maximum size of ${result.current.maxSize} exceeded.`
      );
    }
    expect(result.current.array).toBe(null);
    act(() => {
      result.current.flush();
    });
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(3)
    })
    expect(result.current.array?.length).toBe(3);
    await
      act(async () => {
        await result.current.write("hello", 5);
      })

    expect(result.current.error).toBeTruthy();
    if (result.current.error) {
      expect(result.current.error.name).toBe(`IndexOutOfTheBoundException`);
      expect(result.current.error.description).toBe(
        `Index ${5} out of bounds for length ${result.current?.array?.length}`
      );
    }
    act(() => {
      result.current.flush();
    });
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(3)
    })
    await
      act(async () => {
        await result.current.access(5);
      })

    expect(result.current.error).toBeTruthy();
    if (result.current.error) {
      expect(result.current.error.name).toBe(`IndexOutOfTheBoundException`);
      expect(result.current.error.description).toBe(
        `Index ${5} out of bounds for length ${result.current?.array?.length}`
      );
    }
  });
});

