import React, { ReactElement } from 'react'
import Main from '../../container/Main'
import Title from '../../ui/Title'

import { ChevronsRight } from 'lucide-react'
import LinksComponent from '../nav/linksComponent'
import ImageComponent from '../imageComponent'
import { Entities, EntityType } from '@/types'
import { buildLinkFromArgs } from '@/lib/utils'

export default function PageComponent({ entityTypes, entityParent, title, description, image }: {
    image: {
        light: string,
        dark: string,
    },
    title: string,
    description: ReactElement,
    entityParent: Entities,
    entityTypes: EntityType[]
}) {

    return (
        <>
            <header className="flex flex-col items-center justify-center gap-4 my-10 w-full">
                <Title xls={5} title={title} />


            </header>

            <main className="flex flex-col gap-14 items-center justify-center max-w-[1400px]">
                <article className="text-2xl flex flex-col gap-2 text-justify">

                    {description}

                </article>

                <ImageComponent image={image} />
                <article className="self-start flex flex-col items-start justify-start gap-4 w-full">

                    <div className=" flex items-center justify-start gap-2">

                        <Title xls={2} h={3} uppercase={false} title={`${title} can be divided in:`} /></div>
                    <div className="flex flex-col items-start just start gap-10 w-full">
                        {entityTypes &&
                            entityTypes.map((entityType) => {

                                return (<div key={`${entityType.link}`} className="flex flex-col w-full ">
                                    <div className="flex items-center justify-start">
                                        <ChevronsRight /><Title uppercase={false} title={`${entityType.name} `} xls={3} h={4} />
                                    </div>

                                    <div className=" flex flex-col items-start justify-start gap-2 border-t border-t-app-off-black ark:border-t-white p-4 w-full">
                                        <p className="text-xl">{entityType.description}</p>
                                        <div className='w-full'>

                                            {entityType.children &&
                                                <LinksComponent title={``} links={entityType.children.map(ent => {
                                                    return {
                                                        name: ent.name,
                                                        enable: ent.enable,
                                                        link: buildLinkFromArgs(entityParent, ent.type.link, ent.link)
                                                    }
                                                })} />

                                            }
                                        </div>
                                    </div>

                                </div>)
                            })
                        }
                    </div>
                </article>




            </main>


        </>
    )
}
