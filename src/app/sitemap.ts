import type { MetadataRoute } from "next";
import AlgorithmService from "@/entities/algorithms/__classes/AlgorithmService";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { buildLinkFromArgs } from "@/lib/utils";

// Generate per request, never at build time: the database is not reachable during `next build`.
export const dynamic = "force-dynamic";

const LAST_MODIFIED = new Date("2025-04-19");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Only query the database in production; other environments get the static pages only.
  const [algorithms, dataStructures] =
    process.env.NODE_ENV === "production"
      ? await Promise.all([AlgorithmService.getAllTypes(), DataStructureService.getAllTypes()])
      : [[], []];

  // Disabled entries redirect to their parent list, so they are not indexable pages.
  const algorithmsSitemap: MetadataRoute.Sitemap = algorithms
    .filter((type) => type.enable)
    .flatMap((type) =>
      type.children
        .filter((child) => child.enable)
        .map((child) => ({
          url: absoluteUrl(buildLinkFromArgs("algorithms", type.link, child.link)),
          lastModified: LAST_MODIFIED,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
    );

  const dataStructuresSitemap: MetadataRoute.Sitemap = dataStructures
    .filter((type) => type.enable)
    .flatMap((type) =>
      type.children
        .filter((child) => child.enable)
        .map((child) => ({
          url: absoluteUrl(buildLinkFromArgs("data-structures", type.link, child.link)),
          lastModified: LAST_MODIFIED,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        })),
    );

  return [
    {
      url: absoluteUrl("/", siteUrl),
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: absoluteUrl("/algorithms"),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/data-structures"),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...algorithmsSitemap,
    ...dataStructuresSitemap,
  ];
}
