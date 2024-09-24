import useResponsive from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

type props = {
    children: ReactNode,
    makeResponsive?: boolean,
    className?: string

}
export default function Section({ children, makeResponsive = false, className }: props) {
    const device = useResponsive()
    return (
        <>
            {((device.isDesktop || device.isTv) && !makeResponsive) ? < div className={cn("flex  items-start justify-start  flex-wrap w-full gap-5 ", className)}>{children}</div> :
                <div className={cn("flex flex-wrap items-end justify-end flex-col w-full gap-5 ", className)}>
                    {children}
                </div>

            }


        </>
    )
}
