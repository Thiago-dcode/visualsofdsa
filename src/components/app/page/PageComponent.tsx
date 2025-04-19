import React, { ReactElement } from 'react'
import Title from '../../ui/Title'
import ImageComponent from '../imageComponent'
import { Entities, EntityType } from '@/types'
import { EntitiesListComponent } from '../EntitiesListComponent'
export default function PageComponent({ entityTypes, entityParent, title, description, image,entityListTitle }: {
    image: {
        light: string,
        dark: string,
    },
    title: string,
    entityListTitle: string,
    description: ReactElement,
    entityParent: Entities,
    entityTypes: EntityType[]
}) {

    return (
        <section>
            <div className="flex flex-col items-center justify-center gap-4 my-10 w-full">
                <Title h={1} xls={5} title={title} />


            </div>

            <div className="flex flex-col gap-14 items-center justify-center max-w-[1400px]">
                <div className="text-2xl flex flex-col gap-2 text-justify">

                    {description}

                </div>

                <ImageComponent image={image} />
                <div className="self-start flex flex-col items-start justify-start gap-4 w-full">

                    <div className=" flex items-center justify-start gap-2">

                        <Title xls={2} h={2} uppercase={false} title={`${entityListTitle} can be divided in:`} /></div>
                 
                    <EntitiesListComponent entityTypes={entityTypes} entityParent={entityParent} />
                </div>




            </div>


        </section>
    )
}
