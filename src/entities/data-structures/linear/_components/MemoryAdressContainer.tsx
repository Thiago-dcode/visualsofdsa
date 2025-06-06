import { generateKey, prefix0 } from '@/lib/utils'
import { MemorySize } from '@/types'
import React, { ReactNode, useCallback, useMemo } from 'react'
import Memory from '@/lib/classes/Memory'


type props = {
    memory: Memory | null,
    index: number,
    showIndex?: boolean,
    size?: MemorySize,
    children: ReactNode
}
function MemoryAdressContainer({ memory, index, showIndex = false, size = MemorySize.M, children }: props) {
    const memoryAdress = useMemo(() => '0x' + prefix0(index), [index])
    // const fontSize = useMemo(() => '0x' + prefix0(index), [size])

    const handleIndexRef =useCallback((element:HTMLDivElement | null) => {
        if(!element || !memory) return null;
        memory.indexRef = element;
    },[memory])
    return (
        <div >
            <div style={{
                width: size + 'px',
            }} title={"Memory address: " + memoryAdress} className={`${MemorySize.S === size ? 'text-xs' : MemorySize.M === size ? 'text-sm' : 'text-lg'} flex items-center justify-center py-2 border dark:border-app-off-white border-app-off-black h-[15px]`}>
                <p className=''>{memoryAdress}</p>
            </div>
            <div className={`${MemorySize.S === size ? 'text-xs' : MemorySize.M === size ? 'text-sm' : 'text-lg'}`} style={{
                width: size + 'px',
                height: size + 'px',

            }}>
                {children}
            </div>
            <div ref={(element)=>{
                handleIndexRef(element)
            }} title={"index: " + index} style={{
                visibility: showIndex ? 'visible' : 'hidden',
                width: size + 'px',
            }} className={` ${MemorySize.S === size ? 'text-xs' : MemorySize.M === size ? 'text-sm' : 'text-lg'} flex items-center justify-center py-2 border dark:border-app-off-white border-app-off-black  h-[15px] relative`}>
                <p>{index}</p>
            </div>
        </div>
    )
}

export default MemoryAdressContainer