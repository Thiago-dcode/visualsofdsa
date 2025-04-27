
import { cn } from '@/lib/utils'
import React, { HTMLAttributes, ReactNode } from 'react'

type props = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode,
    makeResponsive?: boolean,



}
export default function Section({ children, makeResponsive = false, className, ...rest }: props) {
    return (
        <>
            {< div className={cn("flex  items-start justify-start  flex-wrap w-full gap-4", {
                'flex-col items-end justify-start': makeResponsive
            }, className)}>{children}</div>
            }


        </>
    )
}
