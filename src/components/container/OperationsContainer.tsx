'use client'
import { cn } from '@/lib/utils'
import React, { SetStateAction } from 'react'
type OperationsContainerProps = { children: React.ReactNode, makeResponsive?: boolean, className?: string, open?: boolean, setOpen?: (value: SetStateAction<boolean>) => void, enabled?: boolean }
export default function OperationsContainer({ children, makeResponsive = false, className = '', open = false, setOpen = () => { }, enabled = true }: OperationsContainerProps) {

    return (
        <>
            {!makeResponsive ? < div id='operations-container' className={cn("border-b-2 border-b-app-off-gray w-full flex p-1 items-center justify-between gap-1", className, {
                'opacity-25': !enabled
            })} >
                {children}
            </div > : < div id='operations-container' className={cn("border-b-2 border-b-app-off-gray w-full flex items-end justify-between gap-1 p-1", className, {
                'opacity-25': !enabled
            })} >
                {children}
            </div >}

        </>
    )
}
