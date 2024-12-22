import { describe, expect, it } from "vitest";
import {
  createArrayOfNodes,
  createRandomArrayOfNodes,
  createRandomUniqueArrayOfNodes,
  generateKey,
  getMaxInAnArrayOfNodes,
  getMinInAnArrayOfNodes,
  getSpeed,
  getValueNormalized,
  prefix0,
  removePx,
} from "./utils";
import Node from "@/entities/data-structures/linear/_classes/Node";
import Position from "./classes/position/Position";

describe("testing getSpeed", () => {
  it("should return the proper number", () => {
    expect(getSpeed(1)).toBe(1);
    expect(getSpeed(2)).toBe(0.5);
    expect(getSpeed(3)).toBe(0.2);
  });
});
describe("testing prefix0", () => {
  it("should return the number prefixed", () => {
    for (let i = 0; i < 10000; i++) {
      if (i < 10) {
        expect(prefix0(i)).toBe("0" + i);
        continue;
      }
      expect(prefix0(i)).toBe("" + i);
    }
  });
});

describe("testing generateKey", () => {
  it("It should generate key passing null number or string", () => {
    expect(generateKey(null)).toBeTypeOf("string");
    expect(generateKey(1)).toBeTypeOf("string");
    expect(generateKey("asdasd")).toBeTypeOf("string");
  });

  describe("testing removePx", () => {
    it("It should remove px", () => {
      expect(removePx("")).toBe(0);
      expect(removePx("1223")).toBe(1223);
      expect(removePx("asdadfdsfsdf")).toBe(0);
      expect(removePx("-133244px")).toBe(-133244);
      expect(removePx("0000000001px")).toBe(1);
      expect(
        removePx("342343242343254312984792837492834234234.34234234234px")
      ).toBe(342343242343254312984792837492834234234.34234234234);
    });
  });
});

describe("Testing getMinInAnArrayOfNodes", () => {
  it("Should return the min value", () => {
    const arr = [
      0, -1, 2, 4, 6, 4, 7, 44543, -1, 3423, 9, 14, 3, 1111111111, 34324, 0.544,
      -0.3, 235345, 123123, 1111111111, 455, 3, 23324, 1125565,
    ];
    const arrOfNodes = arr.map((n) => new Node(n, new Position(0, 0)));
    expect(getMinInAnArrayOfNodes(arrOfNodes)).toBe(Math.min(...arr));
  });
});
describe("Testing getMaxInAnArrayOfNodes", () => {
  it("Should return the min value", () => {
    const arr = [
      0, -1, 2, 4, 6, 4, 7, 44543, -1, 3423, 9, 14, 3, 1111111111, 34324, 0.544,
      -0.3, 235345, 123123, 1111111111, 455, 3, 23324, 1125565,
    ];
    const arrOfNodes = arr.map((n) => new Node(n, new Position(0, 0)));
    expect(getMaxInAnArrayOfNodes(arrOfNodes)).toBe(Math.max(...arr));
  });
});

describe("Testing getValueNormalized", () => {
  it("Should return a normalize value in a range of [0,1]", () => {
    const arr = [
      0, -1, 2, 4, 6, 4, 7, 44543, -1, 3423, 9, 14, 3, 1111111111, 34324, 0.544,
      -0.3, 235345, 123123, -5, 1111111111, 455, 3, 23324, 1125565,
    ];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const arrNormalized = arr.map((n) => getValueNormalized(n, min, max));
    for (let i = 0; i < arrNormalized.length; i++) {
      if (arr[i] === min) expect(arrNormalized[i]).toBe(0);
      else if (arr[i] === max) expect(arrNormalized[i]).toBe(1);
      else expect(arrNormalized[i] > 0 && arrNormalized[i] < 1).toBeTruthy();
    }
  });
  it("Should return a normalize value in a range of [-1,1]", () => {
    const arr = [
      0, -1, 2, 4, 6, 4, 7, 44543, -1, 3423, 9, 14, 3, 1111111111, 34324, 0.544,
      -0.3, 235345, 123123, -5, 1111111111, 455, 3, 23324, 1125565,
    ];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range:[number,number] = [-1,1];
    const arrNormalized = arr.map((n) => getValueNormalized(n, min, max,range));
    for (let i = 0; i < arrNormalized.length; i++) {
      if (arr[i] === min) expect(arrNormalized[i]).toBe(range[0]);
      else if (arr[i] === max) expect(arrNormalized[i]).toBe(range[1]);
      else expect(arrNormalized[i] > range[0] && arrNormalized[i] < range[1]).toBeTruthy();
    }
  });
});
describe("Testing createArrayOfNodes",()=>{

  it('Should create an array of nodes by a given array',()=>{

    const arr = [
      0, -1, 2, 4, 6, 4, 7, 44543, -1, 3423, 9, 14, 3, 1111111111, 34324, 0.544,
      -0.3, 235345, 123123, -5, 1111111111, 455, 3, 23324, 1125565,
    ];
    const arrayOfNodes = createArrayOfNodes(arr);
    expect(arrayOfNodes.length).toBe(arr.length);
    for (let i = 0; i < arrayOfNodes.length; i++) {
      const node = arrayOfNodes[i];
     expect(arr[i]).toBe(node.data);
      
    }

  })
})
describe("Testing createRandomArrayOfNodes",()=>{

  it('Should create a random array of nodes by a given size',()=>{

    const size = 500;
    const range = [1,10];
    const arrayOfNodes = createRandomArrayOfNodes(size,range);
    expect(arrayOfNodes.length).toBe(size);
    for (let i = 0; i < arrayOfNodes.length; i++) {
      const node = arrayOfNodes[i];
      expect(node.data).toBeGreaterThanOrEqual(range[0])
      expect(node.data).toBeLessThanOrEqual(range[1])
      
    }

  })
})
describe("Testing createRandomUniqueArrayOfNodes",()=>{

  it('Should throw error when create a random UNIQUE array of nodes by a given size',()=>{

    const size = 500;
    const range = [1,10];
 
     try {
      createRandomUniqueArrayOfNodes(size,range);
      expect(false).toBe(true);
  
     } catch (error) {
      expect(true).toBe(true);
     }
   

  })
  it('Should create a random array of nodes by a given size',()=>{

    const size = 500;
    const range = [-1000,1000];
    const arrayOfNodes = createRandomUniqueArrayOfNodes(size,range);
    expect(arrayOfNodes.length).toBe(size);
    const memo:{
      [key:number]:true;
    } = {}
    for (let i = 0; i < arrayOfNodes.length; i++) {
      const node = arrayOfNodes[i];
      expect(memo[node.data]).toBeUndefined();
      memo[node.data];
     
      
      
    }

  })
})
