import React from 'react'
import Main from '../container/Main'
import Title from '../ui/Title'
import { LinkItem } from './nav/type'
import { ChevronsRight } from 'lucide-react'
import LinksComponent from './nav/linksComponent'
import Image from 'next/image'

export default function PageComponent({ linkItem }: {
    linkItem: LinkItem
}) {
    const childrenLinks = linkItem.children;
    return (
        <Main className="">
            <header className="flex flex-col items-center justify-center gap-4 my-10 w-full">
                <Title xls={5} title={linkItem.name} />


            </header>

            <main className="flex flex-col gap-14 items-center justify-center max-w-[1280px]">
                <article className="text-2xl flex flex-col gap-2 text-justify">
                    {linkItem.description}
                </article>

                {linkItem.image && <Image alt='data structure image'src={require(`@/assets/images/${linkItem.image}`)} />}
                <article className="self-start flex flex-col items-start justify-start gap-4 w-full">

                    <div className=" flex items-center justify-start gap-2">

                        <Title xls={2} h={3} uppercase={false} title={`${linkItem.name} can be divided in:`} /></div>
                    <div className="flex flex-col items-start just start gap-10 w-full">
                        {childrenLinks &&
                            childrenLinks.map((childLink) => {

                                return (<div key={`${childLink.link}`} className="flex flex-col w-full ">
                                    <div className="flex items-center justify-start">
                                        <ChevronsRight /><Title uppercase={false} title={`${childLink.name} `} xls={3} h={4} />
                                    </div>

                                    <div className=" flex flex-col items-start justify-start gap-2 border-t border-t-white p-4 w-full">
                                        <p className="text-xl">{childLink.description}</p>
                                        <div className='w-full'>

                                            {childLink?.children &&
                                                <LinksComponent title={``} links={childLink.children} />

                                            }
                                        </div>
                                    </div>

                                </div>)
                            })
                        }
                    </div>
                </article>




            </main>


        </Main>
    )
}
