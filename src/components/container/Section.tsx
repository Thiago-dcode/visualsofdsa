import useResponsive from '@/hooks/useResponsive'
import React, { ReactNode } from 'react'

type props = {
    children: ReactNode,
    makeResponsive?:boolean
}
export default function Section({ children,makeResponsive=false }: props) {
    const device = useResponsive()
    return (
        <>
            {((device.isDesktop || device.isTv)&&!makeResponsive) ? < div className="flex  items-start justify-start  flex-wrap w-full gap-5 ">{children}</div> :
                <div className="flex flex-wrap items-end justify-end  w-full gap-5 ">
                    {children}
                </div>

            }


        </>
    )
}
