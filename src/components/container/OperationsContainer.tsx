'use client'
import useResponsive from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PopOverComponent } from '../ui/PopOverComponent'
import { Menu } from 'lucide-react'

export default function OperationsContainer({ children, makeResponsive = false, className = '', open = false, setOpen = () => { } }: { children: React.ReactNode, makeResponsive?: boolean, className?: string, open?: boolean, setOpen?: (value: SetStateAction<boolean>) => void }) {
    const device = useResponsive(() => {
        setOpen(() => false);
    })


    return (
        <>

            {((device.isDesktop || device.isTv) && !makeResponsive) ? < div className={cn("border-b-2 border-b-app-off-gray w-full wrap flex items-start justify-between gap-1 p-2", className)} >
                {children}
            </div > :
                <div className='w-full flex items-center justify-end px-10'>
                    <PopOverComponent setOpen={setOpen} open={open} className='self-start mr-8 bg-white/90' showBtn={false} trigger={<button onClick={() => {

                    }}><Menu /></button>} content={<div className='flex flex-col items-center gap-4 w-full'>
                        {children}

                    </div>} />
                </div>



            }


        </>
    )
}
