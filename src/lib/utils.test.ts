import { describe, expect, it } from "vitest";
import { generateKey, getSpeed, prefix0, removePx } from "./utils";


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

    expect(generateKey(null)).toBeTypeOf('string')
    expect(generateKey(1)).toBeTypeOf('string')
    expect(generateKey('asdasd')).toBeTypeOf('string')
  });

  describe("testing removePx", () => {
    it("It should remove px", () => {
      expect(removePx("")).toBe(0)
      expect(removePx("1223")).toBe(1223)
      expect(removePx("asdadfdsfsdf")).toBe(0)
      expect(removePx("-133244px")).toBe(-133244)
      expect(removePx("0000000001px")).toBe(1)
      expect(removePx("342343242343254312984792837492834234234.34234234234px")).toBe(342343242343254312984792837492834234234.34234234234)
    });
  });
});