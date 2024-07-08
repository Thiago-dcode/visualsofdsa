import { cn } from '@/lib/utils'
import React from 'react'
import LinearDs from '../_classes/LinearDs'
import { Primitive } from '@/types'
import '../style.css'
function LinearDsContainer({ children, className = '', linearDs, dsType = 'stack' }: { linearDs: LinearDs<Primitive>, children: React.ReactNode, className?: string, dsType?: 'stack' | 'queue' }) {
    return (
        <div className={cn('w-full h-full flex items-center justify-center', className)}>

            <div style={
                {
                    paddingTop: dsType == 'stack' ? linearDs.nodeSpacing + 'px' : '',
                    paddingBottom: dsType == 'queue' ? linearDs.nodeSpacing + 'px' : ''
                }
            } className={`border-l-8 border-r-8 ${dsType == 'stack' ? 'border-b-8 rounded-b-lg' : ''}  border-white px-2`}>

                <div style={{
                    height: `${(linearDs.nodeHeight + linearDs.nodeSpacing) * linearDs.maxSize}px`,
                    width: `${linearDs.width}px`,
                }} className="relative">
                    {children}
                </div>
            </div>

        </div>
    )
}

export default LinearDsContainer