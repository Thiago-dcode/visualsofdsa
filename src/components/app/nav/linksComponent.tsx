import React from 'react'
import Title from '../../ui/Title'
import Link from 'next/link'

import { LinkItem } from './type'
import { cn } from '@/lib/utils'

export default function LinksComponent({ title, links }: {
  title: string,
  links: LinkItem[]

}) {
  return (<div className="flex flex-col  items-start justify-start gap-4 w-full">
    <Title h={3} xls={2} uppercase={false} title={title} />
    <div className="flex  items-start justify-start gap-5 flex-wrap w-full">

      {links.map((link, i) => {

        return (<>
          <Link href={link.enable ? link.link : '#'} key={link.name} className={cn("text-center  h-20 border-4 dark:border-app-off-white border-app-bg-black dark:text-app-off-white text-black hover:bg-app-bauhaus-blue flex items-center justify-center w-52 p-1  rounded-md", {
            'opacity-50 hover:bg-transparent': !link.enable
          })}><Title bold={1} uppercase={false} xls={2} h={5} title={link.name} /></Link>
          {/* {LINKS.length - 2 === i && <p className="font-bold text-2xl">&</p>} */}
        </>)
      })}

    </div>
  </div>)

}
