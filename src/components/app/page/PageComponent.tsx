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
        <section className='w-full flex flex-col items-center justify-center  gap-4'>
            <div className="flex flex-col items-center justify-center w-full text-center">
                <Title h={1} xls={4} title={title} />
            </div>

            <div className="flex flex-col gap-14 items-center justify-center max-w-[1400px]">
                <div className="text-xl phone:text-2xl flex flex-col gap-2 tablet:text-center text-left">

                    {description}

                </div>

                <ImageComponent image={image} />
                <div className="self-start flex flex-col items-start justify-start gap-2 w-full">

                    <div className=" flex items-center justify-center laptop:justify-start">

                        <Title xls={3} h={3} uppercase={false} title={`${entityListTitle}`} /></div>
                 
                    <EntitiesListComponent entityTypes={entityTypes} entityParent={entityParent} />
                </div>




            </div>


        </section>
    )
}
