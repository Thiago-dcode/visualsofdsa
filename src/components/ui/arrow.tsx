import { Edge } from '@/lib/classes/Edge'
import React, { useCallback } from 'react'
export type ArrowShape = {
    x: number,
    y: number,
    width: number,
    angle: number,


}
type ArrowProps = {
    isActive?: boolean
    edge: Edge
}
export default function Arrow({ edge, isActive = false }: ArrowProps) {
    const { x, y, length, angle } = edge.shape;
    const handleRef = useCallback((element: HTMLElement | HTMLDivElement | null) => {
        if (!element) return
        edge.ref = element;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div ref={handleRef} className='node-arrow absolute bg-red-600 flex flex-row justify-end items-center' style={{
            margin: `0px ${angle === 0 ? '5px' : ''}`,
            top: `${y}px`,
            opacity: isActive ? 1 : 0.3,
            left: `${x}px`,
            width: `${length - (angle === 0 ? 9 : 4)}px`,
            height: '5px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: `top left`,
            zIndex: 45
        }}>
            <div style={{
                transform: `rotate(${45}deg)`,
            }} className='node-arrow z[99] w-[15px] h-[15px] border-r-4 border-t-4 rounded-tr-sm border-r-red-600 border-t-red-600 '>

            </div>
        </div>
    )
}
