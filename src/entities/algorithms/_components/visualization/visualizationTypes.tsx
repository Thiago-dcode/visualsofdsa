import { Button } from '@/components/ui/button'
import Title from '@/components/ui/Title'
import { cn } from '@/lib/utils'
import { VisualizationArrays } from '@/types'
import React from 'react'

export default function VisualizationTypes({ visualizationSelected, setVisualization }: {
    visualizationSelected: VisualizationArrays,
    setVisualization: (v: VisualizationArrays) => Promise<void>
}) {

    const visualizationTypes: {
        name: string,
        mode: VisualizationArrays,

    }[] = [
            {
                name: 'Memory Ram',
                mode: 'memoryRam'
            },
            {
                name: 'Bars',
                mode: 'bars'
            },
        ]
    return (
        <div className='flex flex-col  items-start justify-start'>
             <Title xls={-1} h={6} bold={2} uppercase={false} title='Visualization mode:'/>
            <div className='flex  items-center justify-start gap-2'>
           
                {
            visualizationTypes.map((vt, i) => {

                return <Button variant={'no-style'} onClick={async () => {
                    await  setVisualization(vt.mode)
                }} className={cn('p-0 px-2 h-fit py-1 border dark:border-app-off-white border-app-off-black',{
                    'bg-app-bauhaus-indigo-50 border-2 border-app-bauhaus-indigo dark:border-app-bauhaus-indigo': visualizationSelected === vt.mode
                })} key={`visualizationMode-${vt.mode}-${i}`}>{vt.name}</Button>
            })
        }</div>
        </div>
    )
}
