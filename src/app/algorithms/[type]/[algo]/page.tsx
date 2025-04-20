
import PageHeaderTitle from "@/components/app/page/pageHeaderTitle";
import AlgorithmService from "@/entities/algorithms/__classes/AlgorithmService";
import { AlgoSearchType, AlgoSortType } from "@/entities/algorithms/types";
import { appMetadata } from "@/lib/metadata";
import { Metadata, } from "next";
import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ type: string,algo:string }>
  }
   
  export async function generateMetadata(
    { params }: Props
  ): Promise<Metadata> {
    // read route params
    const { type,algo } = await params;
    return appMetadata({title:` ${algo} ${type} algorithm`, description:`Display info about ${algo} ${type} data structure`})
  }
export default async function AlgorithmsPage({ params }: { params:Promise<{ type: string,algo:string }> }) {

    const _params = await params;
    const typeParam = _params.type.toLocaleLowerCase();
    const algoParam = _params.algo.toLocaleLowerCase()
    const algo = await AlgorithmService.getOneByLink(algoParam);

    if (!algo) notFound();

    if (!algo.enable) redirect('/algorithms')
    const getView = () => {

        switch (typeParam) {
            case 'search':
                {
                    const View = dynamic(() => import(`@/entities/algorithms/search/View`), {
                        ssr: true,
                        loading: () => <div>loading</div>,


                    })
                    return <View type={algo.link as AlgoSearchType} />
                }
            case 'sort':

                {
                    const View = dynamic(() => import(`@/entities/algorithms/sort/View`), {
                        ssr: true,
                        loading: () => <div>loading</div>,


                    })
                    return <View type={algo.link as AlgoSortType} />
                }
        }

        return null;
    }

    const view = getView();
    if (view === null) notFound();



    return (

        <>
            <PageHeaderTitle info={algo.description || ''} title={algo.name + ' ' + typeParam } />
            {view}
        </>
    );
}
