import { describe, expect, it } from "vitest";
import { getSpeed, prefix0 } from "./utils";

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
