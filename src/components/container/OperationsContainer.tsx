'use client'
import useResponsive from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from 'react'
import { PopOverComponent } from '../ui/PopOverComponent'
import { ArrowDown, Menu } from 'lucide-react'
import useOnScreen from '@/hooks/useOnScreen';
export default function OperationsContainer({ children, makeResponsive = false, className = '', open = false, setOpen = () => { } }: { children: React.ReactNode, makeResponsive?: boolean, className?: string, open?: boolean, setOpen?: (value: SetStateAction<boolean>) => void }) {
    const device = useResponsive(() => {
        setOpen(() => false);
    })
    
 const {isIntersecting,setRef} = useOnScreen();

    return (
        <>
         {!isIntersecting && <a href='#operations-container' className='scroll-mt-20 fixed top-30 right-10 rounded-full bg-app-off-black dark:bg-app-off-white text-app-off-white dark:text-app-off-black p-1'><ArrowDown/></a>}
            {((device.isDesktop || device.isTv) && !makeResponsive) ? < div id='operations-container' ref={setRef} className={cn("border-b-2 border-b-app-off-gray w-full wrap flex items-start justify-between gap-1 p-2", className)} >
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
