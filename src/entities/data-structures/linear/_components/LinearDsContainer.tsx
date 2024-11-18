import { cn } from '@/lib/utils'
import React from 'react'
import LinearDs from '../_classes/LinearDs'
import { Primitive } from '@/types'
import '../style.css'
function LinearDsContainer({ children, className = '', linearDs, dsType = 'stack' }: { linearDs: LinearDs<Primitive>, children: React.ReactNode, className?: string, dsType?: 'stack' | 'queue' }) {

    console.log(dsType, linearDs.nodeHeight,linearDs.nodeHeightSpacing)
    return (
        <div className={cn('w-full h-full flex items-center justify-center', className)}>

            <div style={
                {
                    paddingTop: dsType == 'stack' ? linearDs.nodeHeightSpacing + 'px' : '',
                    paddingBottom: dsType == 'queue' ? linearDs.nodeHeightSpacing + 'px' : ''
                }
            } className={` border-l-8 border-r-8 ${dsType == 'stack' ? 'border-b-8 rounded-b-lg' : ''} px-2 dark:border-app-off-white border-app-off-black` }>

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