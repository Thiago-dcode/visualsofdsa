
import Main from "@/components/container/Main";
import PageHeaderTitle from "@/components/pageHeaderTitle";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";




export default async function LinearDsPage({ params }: { params: { type: string } }) {
    const dsLinearType = params.type.toLocaleLowerCase();
    const ds = await DataStructureService.getOneByLink(dsLinearType);

    if (!ds) notFound();
    const DsView = dynamic(() => import(`@/entities/data-structures/linear/${ds.link}/View`), {
        ssr: true,
        loading: () => <div>loading</div>
    })
    return (

        <Main>
            <PageHeaderTitle info={ds.description || ''} title={ds.name} />
            <DsView />
        </Main>
    );
}
