import { act, renderHook } from "@testing-library/react";
import Node from "../../../_classes/Node";
import useStaticArray from "../../hooks/useStaticArray";

describe("Testin custom hook useStaticArray", async () => {
  it("Should create an array of nodes", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10);
    });
    expect(result.current.array?.length).toBe(10);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeInstanceOf(Node);
        if (element) expect(element.data).toBeNull();
      }
    }
  });
  it("Should create an array of null", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10, false);
    });
    expect(result.current.array?.length).toBe(10);
    if (result.current.array) {
      for (let i = 0; i < result.current.array.length; i++) {
        const element = result.current.array[i];
        expect(element).toBeNull();
      }
    }
  });
  it("Should write", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(10);
    });
    expect(result.current.array?.length).toBe(10);
    await act(async () => {
      expect(result.current.array).toBeTruthy();
      if (result.current.array?.length) {
        for (let index = 0; index < result.current.array.length; index++) {
          const element = result.current.array[index];
          expect(element).toBeInstanceOf(Node);
          if (element) expect(element.data).toBeNull();
          await result.current.write(index, index);
        }
      }
    });

    expect(result.current.array).toBeTruthy();
    if (result.current.array?.length) {
      for (let index = 0; index < result.current.array.length; index++) {
        const element = result.current.array[index];
        expect(element).toBeInstanceOf(Node);
        if (element) expect(element.data).toBe(index);
      }
    }
    await act(async () => {
      expect(result.current.array).toBeTruthy();
      if (result.current.array?.length) {
        for (let index = 0; index < result.current.array.length; index++) {
          const _element = result.current.array[index];
          await result.current.write(null, index);
        }
      }
    });

    if (result.current.array?.length) {
      for (let index = 0; index < result.current.array.length; index++) {
        const element = result.current.array[index];
        expect(element).toBeInstanceOf(Node);
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
        `A Stack overflow error has ocurred. Array maximum size of ${result.current.maxSize} exceeded.`,
      );
    }
    expect(result.current.array).toBe(null);
    act(() => {
      result.current.flush();
    });
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(3);
    });
    expect(result.current.array?.length).toBe(3);
    await act(async () => {
      await result.current.write("hello", 5);
    });

    expect(result.current.error).toBeTruthy();
    if (result.current.error) {
      expect(result.current.error.name).toBe(`IndexOutOfTheBoundException`);
      expect(result.current.error.description).toBe(
        `Index ${5} out of bounds for length ${result.current?.array?.length}`,
      );
    }
    act(() => {
      result.current.flush();
    });
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.create(3);
    });
    await act(async () => {
      await result.current.access(5);
    });

    expect(result.current.error).toBeTruthy();
    if (result.current.error) {
      expect(result.current.error.name).toBe(`IndexOutOfTheBoundException`);
      expect(result.current.error.description).toBe(
        `Index ${5} out of bounds for length ${result.current?.array?.length}`,
      );
    }
  });
  it("Should create an unsorted unique array of nodes", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.createUnsorted(50);
    });
    const array = result.current.array;
    expect(array?.length).toBe(50);
    const memo: { [value: number]: true } = {};
    let isSorted = true;
    if (array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        expect(element).toBeInstanceOf(Node);
        if (element) {
          const value = element.data;
          expect(value).toBeTypeOf("number");
          if (typeof value === "number") {
            const next = array[index + 1];
            if (next) {
              const nextValue = next.data;
              if (typeof nextValue === "number") {
                if (value > nextValue) {
                  isSorted = false;
                }
              }
            }

            expect(memo[value]).toBeUndefined();

            memo[value] = true;
          }
        }
      }
    }
    expect(isSorted).toBeFalsy();
  });

  it("AC-SH-5: createUnsorted with range and unique:false allows duplicates inside the range", async () => {
    const { result } = renderHook(useStaticArray);
    await act(async () => {
      await result.current.createUnsorted(5, { range: [0, 3], unique: false });
    });
    const array = result.current.array;
    expect(array?.length).toBe(5);
    for (const node of array ?? []) {
      expect(node).toBeInstanceOf(Node);
      const v = node?.data as number;
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(3);
    }
    // 5 values drawn from 4 possible ones: pigeonhole guarantees a duplicate
    expect(new Set(array?.map((n) => n?.data)).size).toBeLessThan(5);
  });

  it("AC-SH-5: createUnsorted(5) keeps unique values within 0..60000", async () => {
    const { result } = renderHook(useStaticArray);
    await act(async () => {
      await result.current.createUnsorted(5);
    });
    const values = (result.current.array ?? []).map((n) => n?.data as number);
    expect(values).toHaveLength(5);
    expect(new Set(values).size).toBe(5);
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(60000);
    }
  });

  it("AC-SH-5: unique with a narrow range still yields unique values", async () => {
    const { result } = renderHook(useStaticArray);
    await act(async () => {
      await result.current.createUnsorted(4, { range: [10, 13] });
    });
    const values = (result.current.array ?? []).map((n) => n?.data as number).sort();
    expect(values).toEqual([10, 11, 12, 13]);
  });

  it("Should create a sorted unique FORWARD array of nodes", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.createSorted(50);
    });
    const array = result.current.array;
    expect(array?.length).toBe(50);
    const memo: { [value: number]: true } = {};
    let isSorted = true;
    if (array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        expect(element).toBeInstanceOf(Node);
        if (element) {
          const value = element.data;
          expect(value).toBeTypeOf("number");
          if (typeof value === "number") {
            const next = array[index + 1];
            if (next) {
              const nextValue = next.data;
              if (typeof nextValue === "number") {
                if (value > nextValue) {
                  isSorted = false;
                }
              }
            }
            expect(memo[value]).toBeUndefined();
            memo[value] = true;
          }
        }
      }
    }
    expect(isSorted).toBeTruthy();
  });
  it("Should create a sorted unique REVERSE array of nodes", async () => {
    const { result } = renderHook(useStaticArray);
    expect(result.current.array).toBe(null);
    expect(result.current.error).toBe(null);
    await act(async () => {
      await result.current.createSorted(50, "descending");
    });
    const array = result.current.array;

    expect(array?.length).toBe(50);
    const memo: { [value: number]: true } = {};
    let isSorted = true;
    if (array) {
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        expect(element).toBeInstanceOf(Node);
        if (element) {
          const value = element.data;
          expect(value).toBeTypeOf("number");
          if (typeof value === "number") {
            expect(memo[value]).toBeUndefined();
            const next = array[index + 1];
            if (next) {
              const nextValue = next.data;
              if (typeof nextValue === "number") {
                if (value < nextValue) {
                  isSorted = false;
                }
              }
            }

            memo[value] = true;
          }
        }
      }
    }
    expect(isSorted).toBeTruthy();
  });
});
