import React, { ReactNode } from 'react'
import Title from './ui/Title'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
type Props = {
    title: string,
    info: ReactNode
}
function PageHeaderTitle({ title, info }: Props) {

    return (
        <div className='flex flex-col w-full items-center justify-center'>
            <Title title={title} />
            <Accordion defaultValue='item-1'  className='w-full' type="single" collapsible>
                <AccordionItem className='flex flex-col w-full items-end'defaultChecked  value="item-1">
                    <AccordionTrigger className='p-1'></AccordionTrigger>
                    <AccordionContent className='text-xl'>
                        {info}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default PageHeaderTitle