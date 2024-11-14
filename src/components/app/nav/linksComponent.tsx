import React from 'react'
import Title from '../../ui/Title'
import Link from 'next/link'

import { LinkItem } from './type'
import { cn } from '@/lib/utils'

export default function LinksComponent({ title, links }: {
  title: string,
  links: LinkItem[]

}) {
  return (<div className="flex flex-col  items-start justify-start gap-4">
    <Title h={3} xls={2} uppercase={false} title={title} />
    <div className="flex  items-center justify-center gap-5 w-full ">

      {links.map((link, i) => {

        return (<>
          <Link href={link.enable ?link.link:'#'} key={link.name} className={cn("text-center  h-20 border-2 bg-white text-black hover:bg-white/80 flex items-center justify-center flex-wrap min-w-52 p-1 w-full rounded-md",{
            'opacity-50':!link.enable
          })}><Title bold={1} uppercase={false} xls={2} h={5} title={link.name} /></Link>
          {/* {LINKS.length - 2 === i && <p className="font-bold text-2xl">&</p>} */}
        </>)
      })}

    </div>
  </div>)

}
