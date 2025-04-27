import { cn } from '@/lib/utils'
import React from 'react'



export default function InputWithButtonContainer({ children, className = '', makeResponsive = false }: { children: React.ReactNode, className?: string, makeResponsive?: boolean }) {
    return (
        <div className={cn({
            "flex max-w-sm items-center space-x-2": !makeResponsive,
            "flex items-center w-full gap-2 justify-end": makeResponsive
        }, className)}>
            {children}
        </div>
    )
}
