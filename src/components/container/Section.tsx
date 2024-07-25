import useResponsive from '@/hooks/useResponsive'
import React, { ReactNode } from 'react'

type props = {
    children: ReactNode
}
export default function Section({ children }: props) {
    const device = useResponsive()
    return (
        <>
            {(device.isDesktop || device.isTv) ? < div className="flex  items-start justify-start   w-full gap-5 ">{children}</div> :
                <div className="flex flex-wrap items-end justify-end  w-full gap-5 ">
                    {children}
                </div>

            }


        </>
    )
}
