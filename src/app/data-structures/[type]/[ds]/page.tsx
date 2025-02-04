
import Main from "@/components/container/Main";
import PageHeaderTitle from "@/components/pageHeaderTitle";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default async function DsPage({ params }: { params: { type: string, ds: string } }) {
    const typeParam = params.type.toLocaleLowerCase();
    const dsParam = params.ds.toLocaleLowerCase()
    const ds = await DataStructureService.getOneByLink(dsParam);

    if (!ds) notFound();

    const DsView = dynamic(() => import(`@/entities/data-structures/${typeParam}/${ds.link}/View`), {
        ssr: true,
        loading: () => <div>loading</div>,

    })
    return (

        <Main>
            <PageHeaderTitle info={ds.description || ''} title={ds.name} />
            <DsView />
        </Main>
    );
}
