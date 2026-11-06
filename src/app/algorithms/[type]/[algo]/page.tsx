import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import JsonLd from "@/components/app/JsonLd";
import PageHeaderTitle from "@/components/app/page/pageHeaderTitle";
import AlgorithmService from "@/entities/algorithms/__classes/AlgorithmService";
import { AlgoSearchType, AlgoSortType } from "@/entities/algorithms/types";
import { appMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { capitalize } from "@/lib/utils";

type Props = {
  params: Promise<{ type: string; algo: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, algo } = await params;
  const typeParam = type.toLocaleLowerCase();
  const algoParam = algo.toLocaleLowerCase();
  const entity = await AlgorithmService.getOneByLink(algoParam);

  if (!entity?.enable) {
    return { title: "Algorithm not found", robots: { index: false, follow: true } };
  }

  const metaDescription = await AlgorithmService.getMetaDescription(algoParam);
  const name = capitalize(entity.name);
  return appMetadata({
    title: `${name} ${typeParam} visualizer`,
    description:
      metaDescription ??
      `Step through the ${entity.name} ${typeParam} algorithm one operation at a time.`,
    path: `/algorithms/${typeParam}/${algoParam}`,
  });
}

export default async function AlgorithmsPage({
  params,
}: {
  params: Promise<{ type: string; algo: string }>;
}) {
  const _params = await params;
  const typeParam = _params.type.toLocaleLowerCase();
  const algoParam = _params.algo.toLocaleLowerCase();
  const algo = await AlgorithmService.getOneByLink(algoParam);

  if (!algo) notFound();

  if (!algo.enable) redirect("/algorithms");
  const getView = () => {
    switch (typeParam) {
      case "search": {
        const View = dynamic(() => import(`@/entities/algorithms/search/View`), {
          ssr: true,
          loading: () => <div>loading</div>,
        });
        return <View type={algo.link as AlgoSearchType} />;
      }
      case "sort": {
        const View = dynamic(() => import(`@/entities/algorithms/sort/View`), {
          ssr: true,
          loading: () => <div>loading</div>,
        });
        return <View type={algo.link as AlgoSortType} />;
      }
    }

    return null;
  };

  const view = getView();
  if (view === null) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Algorithms", item: absoluteUrl("/algorithms") },
      {
        "@type": "ListItem",
        position: 3,
        name: capitalize(typeParam),
        item: absoluteUrl(`/algorithms/${typeParam}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: capitalize(algo.name),
        item: absoluteUrl(`/algorithms/${typeParam}/${algoParam}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHeaderTitle info={algo.description || ""} title={algo.name + " " + typeParam} />
      {view}
    </>
  );
}
