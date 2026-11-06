import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";
import JsonLd from "@/components/app/JsonLd";
import PageHeaderTitle from "@/components/app/page/pageHeaderTitle";
import Loader from "@/components/ui/Loader";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";
import { appMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { capitalize } from "@/lib/utils";

type Props = {
  params: Promise<{ type: string; ds: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, ds } = await params;
  const typeParam = type.toLocaleLowerCase();
  const dsParam = ds.toLocaleLowerCase();
  const entity = await DataStructureService.getOneByLink(dsParam);

  if (!entity?.enable) {
    return { title: "Data structure not found", robots: { index: false, follow: true } };
  }

  const metaDescription = await DataStructureService.getMetaDescription(dsParam);
  const name = capitalize(entity.name);
  return appMetadata({
    title: `${name} data structure visualizer`,
    description:
      metaDescription ??
      `Watch the ${entity.name} ${typeParam} data structure operate step by step.`,
    path: `/data-structures/${typeParam}/${dsParam}`,
  });
}

export default async function DsPage({ params }: Props) {
  const _params = await params;
  const typeParam = _params.type.toLocaleLowerCase();
  const dsParam = _params.ds.toLocaleLowerCase();
  const ds = await DataStructureService.getOneByLink(dsParam);
  if (!ds) notFound();
  if (!ds.enable) redirect("/data-structures");
  const DsView = dynamic(() => import(`@/entities/data-structures/${typeParam}/${ds.link}/View`), {
    ssr: true,
    loading: () => <Loader />,
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: "Data structures",
        item: absoluteUrl("/data-structures"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: capitalize(typeParam.replace("-", " ")),
        item: absoluteUrl(`/data-structures/${typeParam}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: capitalize(ds.name),
        item: absoluteUrl(`/data-structures/${typeParam}/${dsParam}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHeaderTitle info={ds.description || ""} title={ds.name} />
      <DsView />
    </>
  );
}
