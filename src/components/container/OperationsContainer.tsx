'use client'
import useResponsive from '@/hooks/useResponsive'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PopOverComponent } from '../ui/PopOverComponent'
import { Menu } from 'lucide-react'

export default function OperationsContainer({ children, className = '', open = false,setOpen=()=>{} }: { children: React.ReactNode, className?: string, open?:boolean, setOpen?:(value:SetStateAction<boolean>)=>void}) {
    const device = useResponsive(()=>{
        setOpen(()=>false);
    })


    return (
        <>

            {(device.isDesktop || device.isTv) ? < div className={cn("border border-white w-full flex items-center justify-between gap-1 p-4", className)} >
                {children}
            </div > :
            <div className='w-full flex items-center justify-end px-20'>
  <PopOverComponent open={open} className='self-start bg-white/90' showBtn={false} trigger={<button onClick={()=>{
    setOpen(!open)
  }}><Menu/></button>} content={<div className='flex flex-col items-center w-full'>
                    {children}

                </div>} />
            </div>
              
 

            }


        </>
    )
}
