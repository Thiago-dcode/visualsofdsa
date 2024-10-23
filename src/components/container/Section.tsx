import useResponsive from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'
import React, { HTMLAttributes, ReactNode } from 'react'

type props =HTMLAttributes<HTMLDivElement> & {
    children: ReactNode,
    makeResponsive?: boolean,

    

}
export default function Section({ children, makeResponsive = false, className, ...rest }: props) {
    const device = useResponsive()
    return (
        <>
            {((device.isDesktop || device.isTv) && !makeResponsive) ? < div className={cn("flex  items-start justify-start  flex-wrap w-full gap-5 ", className)}>{children}</div> :
                <div className={cn("flex flex-wrap items-end justify-end flex-col w-full gap-5 ", className)} {...rest}>
                    {children}
                </div>

            }


        </>
    )
}
