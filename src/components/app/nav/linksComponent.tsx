import React from 'react'
import Title from '../../ui/Title'
import Link from 'next/link'

import { LinkItem } from './type'
import { cn } from '@/lib/utils'


export default function LinksComponent({ title, links, containerClassname, linksContainerClassname }: {
  title?: string,
  links: LinkItem[],
  containerClassname?: string,
  linksContainerClassname?: string

}) {
  return (<div className={cn("flex flex-col  items-start justify-start gap-4 w-full", containerClassname)}>
    {title && <Title h={3} xls={2} uppercase={false} title={title} />}
    <div className={cn("flex  items-start justify-start gap-5 flex-wrap w-full", linksContainerClassname)}>
      {links.map((entity, i) => {

        return (<>
          <Link href={entity.enable ? entity.link : '#'} key={entity.name} className={cn("text-center  h-20 border-4 dark:border-app-off-white border-app-bg-black dark:text-app-off-white text-black hover:bg-app-bauhaus-blue flex items-center justify-center w-52 p-1  rounded-md", {
            'cursor-pointer': entity.link != '#',
            'cursor-default': entity.link === '#',
            'opacity-50 hover:bg-transparent cursor-default': !entity.enable,

          })}><Title bold={1} uppercase={false} xls={2} h={5} title={entity.name} /></Link>
          {/* {LINKS.length - 2 === i && <p className="font-bold text-2xl">&</p>} */}
        </>)
      })}

    </div>
  </div>)

}
