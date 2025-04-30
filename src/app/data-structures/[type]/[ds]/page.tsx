;
import PageHeaderTitle from "@/components/app/page/pageHeaderTitle";
import Loader from "@/components/ui/Loader";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";
import { appMetadata } from "@/lib/metadata";
import { capitalize } from "@/lib/utils";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ type: string, ds: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // read route params
  const { type, ds } = await params;
  const metaDescription = await DataStructureService.getMetaDescription(ds);
  return appMetadata({ title: `${capitalize(ds)} ${capitalize(type)} data structure visualizer`, description: metaDescription ?? `Learn about ${ds} ${type} data structure` })
}
export default async function DsPage({ params }: Props) {
  const _params = await params;
  const typeParam = _params.type.toLocaleLowerCase();
  const dsParam = _params.ds.toLocaleLowerCase()
  const ds = await DataStructureService.getOneByLink(dsParam);
  if (!ds) notFound();
  if (!ds.enable) redirect('/data-structures');
  const DsView = dynamic(() => import(`@/entities/data-structures/${typeParam}/${ds.link}/View`), {
    ssr: true,
    loading: () => <Loader />,

  })
  return (

    <>
      <PageHeaderTitle info={ds.description || ''} title={ds.name} />
      <DsView />
    </>
  );
}
