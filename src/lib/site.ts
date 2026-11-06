export const FALLBACK_SITE_URL = "http://localhost:3000";

/** Public origin of the site, without a trailing slash. Set via NEXT_PUBLIC_BASE_URL. */
export const siteUrl = (process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");

/** Absolute URL for a site path such as "/algorithms/sort/bubble". */
export const absoluteUrl = (path = "/", base: string = siteUrl): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
};
