
import PageComponent from "@/components/app/PageComponent";
import DataStructureService from "@/entities/data-structures/__classes/DataStructureService";



export default async function DataStructurePage() {
    const dataStructureTypes = await DataStructureService.getAllTypes();
    return (

        <PageComponent entityParent="data-structures" title="Data Structures" description={<>
            <p> <b>A data structure is a way of organizing and storing data in a computer</b> to enable efficient access and use. It encompasses both the logical or mathematical representation of data and its implementation in a computer program. </p>

            <p > Think of it like organizing your belongings in your room—clothes, computer, books, and so on. You could put everything in one spot, like under your bed (very inefficient), but every time you need something, you’d have to dig through the pile.  The more organized your room is, the faster and easier it is to find what you need. Having an efficient <b className="text-app-bauhaus-yellow"> data structure is like having a well-organized room, providing ease, clarity, and a sense of relief that everything is in its place.</b> </p>
        </>} image={{
            dark: 'dsimagedark.png',
            light: 'dsimagelight.png'
        }} entityTypes={dataStructureTypes} />
    );
}
