import { Button } from '@/components/ui/button'
import Title from '@/components/ui/Title'
import { cn } from '@/lib/utils'
import { VisualizationArrays } from '@/types'
import React from 'react'

export default function VisualizationTypes({ visualizationSelected, setVisualization }: {
    visualizationSelected: VisualizationArrays,
    setVisualization: (v: VisualizationArrays) => void
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
             <Title xls={1}  bold={2} uppercase={false} title='Visualization mode:'/>
            <div className='flex  items-center justify-start gap-2'>
           
                {
            visualizationTypes.map((vt, i) => {

                return <Button variant={'no-style'} onClick={() => {
                    setVisualization(vt.mode)
                }} className={cn('dark:border-app-off-white border-app-off-black border-2 dark:hover:bg-app-off-white hover:bg-app-bg-black dark:hover:text-app-off-black hover:text-app-off-white dark:text-app-off-white text-app-off-black',{
                    'bg-app-bauhaus-blue text-whitehover:text-app-off-white dark:hover:text-app-off-white dark:hover:bg-app-bauhaus-blue hover:bg-app-bauhaus-blue': visualizationSelected === vt.mode
                })} key={`visualizationMode-${vt.mode}-${i}`}>{vt.name}</Button>
            })
        }</div>
        </div>
    )
}
