'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronsRight, SquareMenu } from 'lucide-react'
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LinkItem } from './type';
export default function MobileNav({links}:{
    links: LinkItem[]
}) {
    const [open, setOpen] = useState(false);
  return (
    <div className='phone:hidden'>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SquareMenu className='w-7 h-7' />
      </SheetTrigger>
   
      <SheetContent side={'left'} className='dark:bg-app-bg-black bg-app-off-white text-app-text-black dark:text-app-off-white border border-app-bg-black dark:border-app-off-white'>
      <SheetTitle>Menu</SheetTitle>
            <div className='flex flex-col gap-4 mt-2 w-full items-start justify-start'>
          
                {links.map((link, i) => {
                    return <Accordion className='w-full border-b-none' type="single" collapsible  key={`${link.link}-${i}`}>
                      
                        <AccordionItem value={link.link} >
                        <AccordionTrigger className='gap-2 p-0 m-0 pb-1 border-b border-app-bg-black dark:border-app-off-white text-xl w-full font-semibold'>
                            <Link onClick={() => setOpen(false)} href={link.link} className='text-app-text-black dark:text-app-off-white'>{link.name}</Link>
                        </AccordionTrigger>
                        <AccordionContent className='m-0 capitalize w-full p-1'>
                            {link.children?.map((child, i) => {
                                return ( <div key={`${child.link}-${i} w-full`}>
                                    <p className=' text-lg text-gray-400'>{child.name}</p>
                                   <ul key={`${child.link}-${i}`} className='flex flex-col ml-2 gap-1 w-full pb-1'>
                                    {child.children?.map((child, i) => {
                                        return <li key={`${child.link}-${i}`} className= 'w-full flex items-center gap-2 justify-start flex-row'> 
                                           <ChevronsRight className='w-4 h-4'/>   <Link onClick={() => setOpen(false)} href={child.link} className='text-app-text-black dark:text-app-off-white  w-full font-semibold '>{child.name}</Link>
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