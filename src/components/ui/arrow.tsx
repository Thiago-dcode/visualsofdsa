import { Edge } from '@/lib/classes/Edge'
import { cn } from '@/lib/utils'
import React, { useCallback } from 'react'

type ArrowProps = {
    isActive?: boolean,
    extraY?: number,
    extraX?: number,
    extraLenght?: number,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    edge: Edge,
    color?: 'red' | 'green' | 'blue',
    shape?: 'arrow' | 'line'
   

}
export default function EdgeComponent({ edge, isActive = false, extraY = 0, extraX = 0, extraLenght = 0, color = 'red', onCreateEdgeAnimation, shape = 'arrow' }: ArrowProps) {
    const { x, y, length, angle } = edge.shape;
    const handleRef = useCallback(async (element: HTMLElement | HTMLDivElement | null) => {
        if (!element) return
        edge.ref = element;
        if (onCreateEdgeAnimation) await onCreateEdgeAnimation(edge)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (    
        <div ref={(ref) => {
            handleRef(ref)
        }} className={cn('node-arrow absolute flex flex-row justify-end items-center', {
            'bg-app-bauhaus-red': color === 'red',
            'bg-app-bauhaus-green': color === 'green',
            'bg-app-bauhaus-blue': color === 'blue',


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
          { shape === 'arrow' && <div style={{
                transform: `rotate(${45}deg)`,
            }} className={cn('node-arrow z[99] w-[15px] h-[15px] border-r-4 border-t-4 rounded-tr-sm ', {
                ' border-r-app-bauhaus-red border-t-app-bauhaus-red': color === 'red',
                ' border-r-app-bauhaus-green border-t-app-bauhaus-green': color === 'green',
                ' border-r-bauhaus-blue border-t-bauhaus-blue': color === 'blue',


            })}>

            </div>}
        </div>
    )
}
