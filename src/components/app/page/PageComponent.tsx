import React, { ReactElement } from 'react'
import Title from '../../ui/Title'
import ImageComponent from '../imageComponent'
import { Entities, EntityType } from '@/types'
import { EntitiesListComponent } from '../EntitiesListComponent'
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
                 
                    <EntitiesListComponent entityTypes={entityTypes} entityParent={entityParent} />
                </article>




            </main>


        </>
    )
}
