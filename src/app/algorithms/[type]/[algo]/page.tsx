
import Main from "@/components/container/Main";
import PageHeaderTitle from "@/components/pageHeaderTitle";
import AlgorithmService from "@/entities/algorithms/__classes/AlgorithmService";
import { AlgoSearchType, AlgoSortType } from "@/entities/algorithms/types";
import View from "@/entities/data-structures/linear/linked-list/View";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default async function AlgorithmsPage({ params }: { params: { type: string, algo: string } }) {

    const typeParam = params.type.toLocaleLowerCase();
    const algoParam = params.algo.toLocaleLowerCase()
    const algo = await AlgorithmService.getOneByLink(algoParam);

    if (!algo) notFound();

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

        <Main>
            <PageHeaderTitle info={algo.description || ''} title={algo.name} />
            {view}
        </Main>
    );
}
