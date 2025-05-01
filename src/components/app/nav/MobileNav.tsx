'use client'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronsRight, Dot, SquareMenu } from 'lucide-react'
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LinkItem } from './type';
import { config } from '@/config'
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export default function MobileNav({ links }: {
  links: LinkItem[]
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [, mainPage, , entityPage] = pathname.split('/')
  return (
    <div className='phone:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger  asChild className='cursor-pointer'>
          <SquareMenu className='w-7 h-7' />
        </SheetTrigger>

        <SheetContent side={'left'} className={cn(config.darkModeModal, 'overflow-y-auto')}>
          <SheetTitle>Menu</SheetTitle>
          <div className='flex flex-col gap-4 mt-2 w-full items-start justify-start'>

            {links.map((link, i) => {
              return <Accordion className='w-full border-b-none ' type="single" collapsible key={`${link.link}-${i}`}>

                <AccordionItem value={link.link} >
                  <AccordionTrigger iconSide='left' className={cn('gap-2 p-0 m-0 pb-1 border-b border-app-bg-black dark:border-app-off-white text-xl w-full font-semibold', {
                    'border-b-2 dark:border-app-bauhaus-blue border-app-bauhaus-blue': link.link === '/' + mainPage,
                  })}>
                    <Link onNavigate={() => setOpen(false)} href={link.link} className='text-app-text-black dark:text-app-off-white'><h3>{link.name}</h3></Link>
                  </AccordionTrigger>
                  <AccordionContent className='m-0 capitalize w-full p-1  flex flex-col gap-2 items-start justify-start'>
                    {link.children?.map((child, i) => {
                      return (<div  key={`${child.link}-${i} w-full`}>
                        <h4 className=' text-lg dark:text-gray-400 text-gray-600'>{child.name}</h4>
                        <ul key={`${child.link}-${i}`} className='flex flex-col ml-2 gap-1 w-full pb-1 '>
                          {child.children?.map((child, i) => {
                            const childPage = child.link.split('/')[3]
                            return <li key={`${child.link}-${i}`} className='w-full flex items-center gap-1 justify-start '>
                              <Dot className='w-6 h-6' />   <Link onNavigate={() => {
                                if (child.enable || childPage !== entityPage) setOpen(false)
                              }} href={child.enable  ? child.link : '#'} className={cn(
                                'text-app-text-black dark:text-app-off-white  w-full font-semibold text-sm', {
                                ' border-b-2 border-app-bauhaus-blue dark:border-app-bauhaus-blue py-1 ': childPage === entityPage,
                                  'cursor-not-allowed  opacity-75 text-normal italic': !child.enable
                                }
                              )}>{child.name}{!child.enable ? <span className='text-xs text-gray-600 dark:text-gray-400 italic font-normal'> (Coming Soon)</span> : null}</Link>
                            </li>
                          })}
                        </ul>
                      </div>)


                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}