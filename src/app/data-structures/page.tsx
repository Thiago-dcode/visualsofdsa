
import { LINKS } from "@/components/app/nav/links";
import LinksComponent from "@/components/app/nav/linksComponent";
import Main from "@/components/container/Main";
import { Separator } from "@/components/ui/separator";
import Title from "@/components/ui/Title";
import { links } from "@/config";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";


export default function DataStructurePage() {
    const dsLinks = LINKS[0].children;
    return (

        <Main className="">
            <header className="flex flex-col items-center justify-center gap-4 my-10 w-full">
                <Title xls={5} title="DATA STRUCTURES" />


            </header>

            <main className="flex flex-col gap-14 items-center justify-center max-w-[1280px]">
                <article className="text-2xl flex flex-col gap-2 text-justify">
                    <p> <b>A data structure is a way of organizing and storing data in a computer</b> to enable efficient access and use. It encompasses both the logical or mathematical representation of data and its implementation in a computer program. </p>

                    <p > Think of it like organizing your belongings in your room—clothes, computer, books, and so on. You could put everything in one spot, like under your bed (very inefficient), but every time you need something, you’d have to dig through the pile.  The more organized your room is, the faster and easier it is to find what you need. Having an efficient <b className="text-yellow-400"> data structure is like having a well-organized room, providing ease, clarity, and a sense of relief that everything is in its place.</b> </p>
                </article>


                <article className="self-start flex flex-col items-start justify-start gap-4">

                    <div className=" flex items-center justify-start gap-2">

                        <Title xls={2} h={3} uppercase={false} title={'Data structures can be divided in two categories:'} /></div>
                    <div className="flex flex-col items-start just start gap-10">
                        {dsLinks &&
                            dsLinks.map((dsType) => {

                                return (<div key={`${dsType.link}`} className="flex flex-col w-full ">
                                    <div className="flex items-center justify-start">
                                    <ChevronsRight/><Title uppercase={false} title={`${dsType.name} `} xls={3} h={4} />
                                    </div>
                                   
                                    <div className=" flex flex-col items-center justify-center gap-2 border-t border-t-white p-4">
                                    <p className="text-xl">{dsType.description}</p>    
                                        <div>
                                           
                                            {dsType?.children && <div>
                                                {<LinksComponent title={``} links={dsType.children} />}

                                            </div>}
                                        </div>
                                    </div>
                                 
                                </div>)
                            })
                        }
                    </div>
                </article>




            </main>


        </Main>
    );
}
