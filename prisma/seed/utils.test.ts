import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { BigOType, buildDescription, getComplexity } from "./utils";

describe("getComplexity", () => {
  it("AC-SH-6: describes n + k", () => {
    expect(getComplexity("n + k")).toBe("Linear in the input size plus the value range");
  });

  it("AC-SH-6: describes d(n + k)", () => {
    expect(getComplexity("d(n + k)")).toBe(
      "d passes, each linear in the input size plus the digit range",
    );
  });

  it("existing complexities are unchanged", () => {
    expect(getComplexity("1")).toBe("Constant time operation");
    expect(getComplexity("n^2")).toBe("Quadratic time operation");
    expect(getComplexity("log n")).toBe("Logarithmic time operation");
  });
});

describe("seed BigOType validity (AC-INT-3)", () => {
  const valid: BigOType[] = [
    "1",
    "n",
    "n^2",
    "log n",
    "n log n",
    "n^3",
    "2^n",
    "n!",
    "n*n!",
    "n + k",
    "d(n + k)",
    "∞",
  ];

  // seed.ts executes on import and opens a DB connection, so it is read as text only.
  const seed = readFileSync(resolve(__dirname, "seed.ts"), "utf8");

  it("AC-INT-3: every averageCase/worstCase literal in the seed is a valid BigOType", () => {
    const matches = [...seed.matchAll(/(?:averageCase|worstCase):\s*"([^"]*)"/g)];
    expect(matches.length).toBeGreaterThan(0);
    for (const m of matches) {
      expect(valid, `invalid BigO "${m[1]}"`).toContain(m[1]);
      // every valid value has a dedicated description (the default branch echoes the input)
      expect(getComplexity(m[1] as BigOType)).not.toBe(m[1]);
    }
  });

  const entries = [
    { name: "AVL Tree", link: "avl-tree" },
    { name: "Binary Heap", link: "binary-heap" },
    { name: "Counting", link: "counting" },
    { name: "Radix", link: "radix" },
    { name: "Bucket", link: "bucket" },
  ];

  for (const entry of entries) {
    it(`AC-INT-3: seed entry "${entry.name}" is enabled with a <=160 char meta description and full description`, () => {
      const nameIdx = seed.indexOf(`name: "${entry.name}"`);
      expect(nameIdx).toBeGreaterThanOrEqual(0);
      // the entry object runs until the next entry starts with its "order:" key
      const nextMatch = /\n\s*order:/.exec(seed.slice(nameIdx + 10));
      const next = nextMatch ? nameIdx + 10 + nextMatch.index : -1;
      const block = seed.slice(nameIdx, next === -1 ? undefined : next);
      expect(block).toContain(`link: "${entry.link}"`);
      expect(block).toMatch(/enable:\s*true/);
      const meta = block.match(/metaDescription:\s*(?:\n\s*)?"([^"]+)"/);
      expect(meta, "metaDescription missing").not.toBeNull();
      const text = meta?.[1] ?? "";
      expect(text.length).toBeGreaterThan(0);
      expect(text.length).toBeLessThanOrEqual(160);
      expect(block).toContain("coreCharacteristics");
      expect(block).toContain("keyOperations");
      expect(block).toContain("commonApplications");
    });
  }
});

describe("buildDescription", () => {
  it("renders sections and complexity descriptions for the new BigO values", () => {
    const html = buildDescription({
      description: "d",
      coreCharacteristics: ["c"],
      keyOperations: [
        {
          operation: "Sort",
          color: "yellow",
          description: "sorts",
          averageCase: "n + k",
          worstCase: "n + k",
        },
        {
          operation: "Sort",
          color: "yellow",
          description: "sorts",
          averageCase: "d(n + k)",
          worstCase: "d(n + k)",
        },
      ],
      commonApplications: ["a"],
    });
    expect(html).toContain("O(n + k)");
    expect(html).toContain("O(d(n + k))");
    expect(html).toContain("Linear in the input size plus the value range");
  });
});
