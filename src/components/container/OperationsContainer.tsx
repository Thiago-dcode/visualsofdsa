'use client'
import { cn } from '@/lib/utils'
import React, { SetStateAction } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { SquareChevronDown, SquareChevronUp } from 'lucide-react'
type OperationsContainerProps = { children: React.ReactNode, makeResponsive?: boolean, className?: string, open?: boolean, setOpen?: (value: SetStateAction<boolean>) => void, enabled?: boolean }
export default function OperationsContainer({ children, makeResponsive = false, className = '', open = false, setOpen = () => { }, enabled = true }: OperationsContainerProps) {

    return (
        <>
            {!makeResponsive ? < div id='operations-container' className={cn("border-b-2 border-b-app-off-gray w-full flex p-1 items-end justify-between gap-1", className, {
                'opacity-25': !enabled
            })} >
                {children}
            </div > : <div className='flex items-center justify-center py-2'>
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger disabled={!enabled} asChild className={cn('cursor-pointer', {
                            'cursor-wait opacity-25': !enabled
                        })} >
                          {!open ? <SquareChevronDown className='font-bold w-6 h-6'  /> : <SquareChevronUp className='font-bold w-6 h-6'  />}
                        </DropdownMenuTrigger>
                    <DropdownMenuContent className={cn('dark:bg-app-bg-black bg-app-off-white text-app-text-black dark:text-app-off-white border border-app-bg-black dark:border-app-off-white min-w-fit',className)}>
                        {children}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>}

        </>
    )
}
