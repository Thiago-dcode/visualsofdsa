import { cn } from '@/lib/utils'
import React from 'react'
import LinearDs from '../_classes/LinearDs'
import { Primitive } from '@/types'
function LinearDsContainer({ children, className = '', linearDs}: { linearDs: LinearDs<Primitive>, children: React.ReactNode, className?: string, dsType?: 'stack' | 'queue' }) {

    return (
        <div className={cn('w-full h-full flex items-center justify-center', className)}>

            <div  className={` border-l-8 border-r-8 ${linearDs.name == 'stack' ? 'border-b-8 rounded-b-lg' : ''} px-2 dark:border-app-off-white border-app-off-black` }>

                <div style={{
                    height: `${(linearDs.nodeHeight + linearDs.nodeHeightSpacing) * linearDs.maxSize}px`,
                    width: `${linearDs.width}px`,
                }} className="relative">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default LinearDsContainer