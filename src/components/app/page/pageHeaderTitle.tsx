'use client'
import React, { useState } from 'react'
import Title from '../../ui/Title'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion'
import { Eye, EyeOff } from 'lucide-react'
import './style.css'
import { cn } from '@/lib/utils'
import { useAnimationRunning } from '@/context/animationRunningContext'
type Props = {
    title: string,
    info: string
}
function PageHeaderTitle({ title, info }: Props) {
    const [open, setOpen] = useState<boolean>(true);
    const { isAnimationRunning } = useAnimationRunning()

    return (
        <div className={cn('flex flex-col w-full items-start justify-start ', {
            'opacity-25': isAnimationRunning
        })}>

            <Accordion onValueChange={(e) => {
                setOpen(!!e);
            }} defaultValue={open ? "item-1" : undefined} className='w-full' type="single" collapsible>
                <AccordionItem onSelect={(e) => {
                }} className='flex flex-col w-full gap-2' value="item-1">
                    <AccordionTrigger showIcon={false} className={cn('flex items-center justify-center gap-2 p-0')}> <Title title={title} xls={3} h={1} /> {open ? <Eye /> : <EyeOff />}</AccordionTrigger>

                    <AccordionContent className=' w-full tablet:text-lg' >
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