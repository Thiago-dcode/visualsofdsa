import sitemap from "./sitemap";

const mocks = vi.hoisted(() => ({
  algorithms: vi.fn(),
  dataStructures: vi.fn(),
}));

vi.mock("@/entities/algorithms/__classes/AlgorithmService", () => ({
  default: { getAllTypes: mocks.algorithms },
}));
vi.mock("@/entities/data-structures/__classes/DataStructureService", () => ({
  default: { getAllTypes: mocks.dataStructures },
}));

const child = (link: string, enable: boolean) => ({ link, enable });

const setup = (enable: boolean) => {
  mocks.algorithms.mockResolvedValue([
    {
      link: "sort",
      enable: true,
      children: [
        child("bubble", true),
        child("counting", enable),
        child("radix", enable),
        child("bucket", enable),
      ],
    },
  ]);
  mocks.dataStructures.mockResolvedValue([
    {
      link: "non-linear",
      enable: true,
      children: [
        child("binary-search-tree", true),
        child("avl-tree", enable),
        child("binary-heap", enable),
      ],
    },
  ]);
};

const NEW_PATHS = [
  "/data-structures/non-linear/avl-tree",
  "/data-structures/non-linear/binary-heap",
  "/algorithms/sort/counting",
  "/algorithms/sort/radix",
  "/algorithms/sort/bucket",
];

describe("sitemap", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    mocks.algorithms.mockReset();
    mocks.dataStructures.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("AC-INT-5: lists the five new entries as absolute URLs when enabled", async () => {
    setup(true);
    const urls = (await sitemap()).map((e) => e.url);
    for (const path of NEW_PATHS) {
      const match = urls.find((u) => u.endsWith(path));
      expect(match, `missing ${path}`).toBeDefined();
      expect(match).toMatch(/^https?:\/\//);
    }
    expect(urls.some((u) => u.endsWith("/algorithms/sort/bubble"))).toBe(true);
  });

  it("AC-INT-5: omits the five new entries when enable is false", async () => {
    setup(false);
    const urls = (await sitemap()).map((e) => e.url);
    for (const path of NEW_PATHS) {
      expect(
        urls.some((u) => u.endsWith(path)),
        `unexpected ${path}`,
      ).toBe(false);
    }
    expect(urls.some((u) => u.endsWith("/algorithms/sort/bubble"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/data-structures/non-linear/binary-search-tree"))).toBe(
      true,
    );
  });

  it("AC-INT-5: disabled parent types hide all their children", async () => {
    mocks.algorithms.mockResolvedValue([
      { link: "sort", enable: false, children: [child("counting", true)] },
    ]);
    mocks.dataStructures.mockResolvedValue([]);
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/algorithms/sort/counting"))).toBe(false);
  });

  it("does not query the database outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    setup(true);
    const urls = (await sitemap()).map((e) => e.url);
    expect(mocks.algorithms).not.toHaveBeenCalled();
    expect(urls.some((u) => u.endsWith("/algorithms/sort/counting"))).toBe(false);
  });
});
