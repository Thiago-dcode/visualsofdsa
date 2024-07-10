import { cn } from '@/lib/utils'
import React from 'react'



export default function InputWithButtonContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("flex max-w-sm items-center space-x-2", className)}>
            {children}
        </div>
    )
}
