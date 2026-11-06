import { describe, expect, it } from "vitest";
import { appMetadata } from "./metadata";
import { absoluteUrl } from "./site";

describe("absoluteUrl", () => {
  it("keeps the protocol intact and adds the leading slash", () => {
    expect(absoluteUrl("/algorithms/sort/bubble", "https://example.com")).toBe(
      "https://example.com/algorithms/sort/bubble",
    );
    expect(absoluteUrl("algorithms", "https://example.com")).toBe("https://example.com/algorithms");
  });

  it("returns the base for the root path", () => {
    expect(absoluteUrl("/", "https://example.com")).toBe("https://example.com/");
  });
});

describe("appMetadata", () => {
  it("adds the site suffix, canonical and Open Graph fields for a path", () => {
    const meta = appMetadata({
      title: "Bubble sort",
      description: "Sort step by step.",
      path: "/algorithms/sort/bubble",
    });
    expect(meta.title).toBe("Bubble sort | Visualsofdsa");
    expect(meta.alternates?.canonical).toBe("/algorithms/sort/bubble");
    expect(meta.openGraph).toMatchObject({
      title: "Bubble sort | Visualsofdsa",
      description: "Sort step by step.",
      url: "/algorithms/sort/bubble",
      siteName: "Visualsofdsa",
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("omits canonical when no path is given", () => {
    const meta = appMetadata({ title: "Home" });
    expect(meta.alternates).toBeUndefined();
  });

  it("lets a page override robots", () => {
    const meta = appMetadata({ robots: "noindex, nofollow" });
    expect(meta.robots).toBe("noindex, nofollow");
  });
});
