import { cn } from '@/lib/utils'
import React from 'react'



export default function Main({ children,className = '' }: { children: React.ReactNode,className?:string }) {
  return (
    <main className={cn('main-container flex flex-col items-center gap-2 tablet:gap-6 w-full phone:px-5 phone:py-8 py-3 px-4 min-h-screen', className)}>
        {children}
    </main>
  )
}
