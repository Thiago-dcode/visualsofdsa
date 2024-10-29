import { Edge } from '@/lib/classes/Edge'
import { cn } from '@/lib/utils'
import React, { useCallback } from 'react'
export type ArrowShape = {
    x: number,
    y: number,
    width: number,
    angle: number,


}
type ArrowProps = {
    isActive?: boolean,
    extraY?: number,
    extraX?: number,
    extraLenght?: number,
    edge: Edge,
    color?: 'red' | 'green' | 'blue'
}
export default function Arrow({ edge, isActive = false, extraY = 0, extraX = 0, extraLenght = 0, color = 'red' }: ArrowProps) {
    const { x, y, length, angle } = edge.shape;
    const handleRef = useCallback((element: HTMLElement | HTMLDivElement | null) => {
        if (!element) return
        edge.ref = element;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div ref={handleRef} className={cn('node-arrow absolute flex flex-row justify-end items-center', {
            'bg-red-600': color === 'red',
            'bg-green-600': color === 'green',
            'bg-blue-600': color === 'blue',
       

        })} style={{
            margin: `0px ${angle === 0 ? '5px' : ''}`,
            top: `${y + extraY}px`,
            opacity: isActive ? 1 : 0.3,
            left: `${x + extraX}px`,
            width: `${length + extraLenght - (angle === 0 ? 9 : 4)}px`,
            height: '5px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: `top left`,
            zIndex: 45
        }}>
            <div style={{
                transform: `rotate(${45}deg)`,
            }} className={cn('node-arrow z[99] w-[15px] h-[15px] border-r-4 border-t-4 rounded-tr-sm ', {
                ' border-r-red-600 border-t-red-600': color === 'red',
                ' border-r-green-600 border-t-green-600': color === 'green',
                ' border-r-blue-600 border-t-blue-600': color === 'blue',
              

            })}>

            </div>
        </div>
    )
}
