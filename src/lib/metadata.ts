import { Metadata } from "next/types";

const SITE_NAME = "Visualsofdsa";
const DEFAULT_DESCRIPTION =
  "Master computer science concepts through interactive data structures and algorithm animations. Explore binary trees, graph traversals, and sorting methods with real-time visualizations. Ideal for coding interview prep and CS education.";

type AppMetadataInput = Metadata & {
  /** Site path of the page (e.g. "/algorithms/sort/bubble"). Sets the canonical URL and og:url. */
  path?: string;
};

export const appMetadata = ({ title, description, path, ...rest }: AppMetadataInput): Metadata => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const finalDescription = description || DEFAULT_DESCRIPTION;

  return {
    title: fullTitle,
    applicationName: SITE_NAME,
    description: finalDescription,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      ...(path ? { url: path } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
    },
    ...rest,
  };
};
