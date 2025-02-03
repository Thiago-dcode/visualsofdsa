
import React from 'react'
import { Button } from './button'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'
import { InfoIcon } from 'lucide-react'
export default function Info({ className = '', size = 30, text, html, color, title, trigger = <InfoIcon size={size} />
}: {
    className?: string,
    size?: number;
    text?: React.ReactNode;
    html?: string,
    color?: string,
    trigger?: React.ReactNode;
    title: string
}) {
    return (
        <HoverCard  >
            <HoverCardTrigger asChild className={className}>
                <Button size={'icon'} variant="link">
                    {trigger}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-screen  px-5 overflow-scroll max-w-[1200px] dark:bg-black bg-white">
                <article className="flex flex-col w-full gap-2 items-center  overflow-auto">

                    <header><h3 className="text-xl text-center font-bold">{title}</h3></header>
                    {text ? <main className='text-xl font-mono text-justify p-2 max-h-[600px] '>{text}</main> : html ? <main dangerouslySetInnerHTML={{
                        __html: html
                    }} className='text-xl font-mono text-justify p-2 max-h-[600px] '></main> : <main className='text-xl font-mono text-justify p-2 max-h-[600px] '></main>}

                </article>
            </HoverCardContent>
        </HoverCard>
    )
}
