'use client'

import React, { useState } from 'react'
import Title from './ui/Title'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Eye, EyeOff } from 'lucide-react'
type Props = {
    title: string,
    info: string
}
function PageHeaderTitle({ title, info }: Props) {
    const [open,setOpen] = useState<boolean>(true);
    return (
        <div className='flex flex-col w-full items-center justify-center'>
            <Accordion onValueChange={(e)=>{
                setOpen(!!e);
            }} defaultValue={open?"item-1":undefined} className='w-full' type="single" collapsible>
                <AccordionItem onSelect={(e)=>{
                }}  className='flex flex-col w-full' value="item-1">
                    <AccordionTrigger showIcon={false} className='flex items-center justify-center gap-4'> <Title title={title} /> {open?<Eye/>:<EyeOff/>}</AccordionTrigger>
                  
                    <AccordionContent  className='text-xl' >
                        <div dangerouslySetInnerHTML={{
                            __html: info
                        }} >

                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default PageHeaderTitle