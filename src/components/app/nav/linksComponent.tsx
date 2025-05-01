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
    <div className={cn("flex  items-start justify-center tablet:justify-start gap-5 flex-wrap w-full", linksContainerClassname)}>
      {links.map((entity, i) => {

        return (<div key={`${entity.name}-${i}`} className=' phone:px-0'>
          <Link href={entity.enable ? entity.link : '#'} className={cn("  bg-app-bauhaus-indigo-50  text-center  phone:h-16 h-14 border-4  border-app-bauhaus-indigo dark:text-app-off-white text-app-off-black dark:hover:border-app-bauhaus-yellow hover:border-app-bauhaus-yellow flex items-center justify-center phone:w-60 p-1 w-40 rounded-md  ", {
            'cursor-pointer': entity.link != '#',
            'opacity-50 hover:bg-transparent cursor-default pointer-events-none': !entity.enable || entity.link === '#',

          })}><p className='tablet:text-xl text-lg font-semibold capitalize flex flex-col items-center justify-center'>{entity.name} {!entity.enable ? <span className='text-xs text-gray-400 italic'> (Coming Soon)</span> : null}</p></Link>
          {/* {LINKS.length - 2 === i && <p className="font-bold text-2xl">&</p>} */}
        </div>)
      })}

    </div>
  </div>)

}
