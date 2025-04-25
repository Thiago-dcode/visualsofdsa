import React from 'react'
import LinksComponent from './nav/linksComponent'
import { buildLinkFromArgs } from '@/lib/utils'
import { EntityType, Entities } from '@/types'
import Title from '../ui/Title'
import { ChevronsRight } from 'lucide-react'
type EntitiesListComponentProps ={
    entityTypes: EntityType[]
    entityParent: Entities
}
export const EntitiesListComponent = ({entityTypes,entityParent}:EntitiesListComponentProps) => {
  return (
    <div className="flex flex-col items-start justify-center laptop:justify-start w-full gap-10">
                        {entityTypes &&
                            entityTypes.map((entityType) => {

                                return (<div key={`${entityType.link}`} className="flex flex-col w-full">
                                    <div className="flex items-center justify-start">
                                       <Title uppercase={false} title={`${entityType.name}`} xls={2} h={4}  bold={2} className='capitalize'/>
                                    </div>
                                    <div className=" flex flex-col items-start justify-center laptop:justify-start w-full gap-3">
                                        <p className="">{entityType.description}</p>
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
  )
}
