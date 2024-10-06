import React, { ReactNode } from 'react'
import { Heap } from '@/hooks/useHeap'

function HeapContainer({ heap, children }: {
    heap: Heap,
    children: ReactNode
}) {
    const { width, height, size } = heap;
    return (
        <section className=''>
            {size > 0 ? <>
                <div className='mb-2'>
                    <h4 className='text-4xl'>Heap</h4>

                </div>
                <div className='p-4 border-white border-2 rounded-sm'>
                    <div className='relative' style={{
                        width: width + 'px',
                        height: height + 'px'
                    }}>
                        {children}
                    </div>
                </div>
                </> : null}
        </section>
    )
}



export default HeapContainer