import { cn } from '@/lib/utils'
import React from 'react'



export default function Main({ children,className = '' }: { children: React.ReactNode,className?:string }) {
  return (
    <main className={cn('main-container', className)}>
        {children}
    </main>
  )
}
