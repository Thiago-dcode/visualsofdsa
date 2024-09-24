import React, { ReactNode } from 'react'
import Properties from '../app/Properties'

function HeapContainer({ width, height, children }: {
    width: number,
    height: number,
    children: ReactNode
}) {

    return (
        <section className=''>
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
        </section>
    )
}



export default HeapContainer