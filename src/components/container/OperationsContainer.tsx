import { cn } from '@/lib/utils'
import React from 'react'



export default function OperationsContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        < div className={cn("border border-white w-full flex items-center justify-between gap-1 p-4", className)} >
            {children}
        </div >
    )
}
