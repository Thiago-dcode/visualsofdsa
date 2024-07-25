import { prefix0 } from '@/lib/utils'
import { MemorySize } from '@/types'
import React, { ReactNode, useMemo } from 'react'


type props = {
    index: number,
    showIndex:boolean,
    size?: MemorySize,
    children: ReactNode
}
function MemoryAdressContainer({ index,showIndex, size = MemorySize.M,children }: props) {
    const memoryAdress = useMemo(() => '0x' + prefix0(index), [index])
    return (
        <div key={'static-array-empty-' + index}>
            <div style={{
                width: size + 'px',
            }} title={"Memory address: " + memoryAdress} className="text-sm flex items-center justify-center py-2 border border-white h-[15px]">
                <p>{memoryAdress}</p>
            </div>
            <div style={{
                width: size + 'px',
                height: size + 'px',

            }}>
                {children}
            </div>
            <div title={"index: " + index} style={{
                visibility: showIndex? 'visible' : 'hidden',
                width: size + 'px',
            }} className={"text-sm flex items-center justify-center py-2 border border-white  h-[15px]"}>
                <p>{index}</p>
            </div>
        </div>
    )
}

export default MemoryAdressContainer