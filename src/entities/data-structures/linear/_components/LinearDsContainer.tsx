import { cn } from '@/lib/utils'
import React from 'react'
import LinearDs from '../_classes/LinearDs'
import { listName, Primitive } from '@/types'
function LinearDsContainer({ children, className = '', listName, width,height}: { listName: listName, children: React.ReactNode, className?: string, width: number,height:number }) {

    return (
        <div className={cn('w-full h-full flex items-center justify-center px-4', className)}>

            <div  className={` border-l-8 border-r-8 ${listName == 'stack' ? 'border-b-8 rounded-b-lg' : ''} px-2 dark:border-app-off-white border-app-off-black` }>

                <div style={{
                    height: `${height}px`,
                    width: `${width}px`,
                }} className="relative phone:w-auto ">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default LinearDsContainer