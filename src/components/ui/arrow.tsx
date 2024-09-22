import React from 'react'
type ArrowShape = {
    x: number,
    y: number,
    width: number,
    angle: number,


}
type ArrowProps = {
    isActive?: boolean
    arrowShape: ArrowShape
}
export default function Arrow({ arrowShape, isActive = false }: ArrowProps) {
    const { x, y, width, angle } = arrowShape;

    return (
        <div className='node-arrow absolute bg-red-600 flex flex-row justify-end items-center' style={{
            margin: `0px ${angle === 0 ? '5px' : ''}`,
            top: `${y}px`,
            opacity: isActive ? 1 : 0.3,
            left: `${x}px`,
            width: `${width - (angle === 0 ? 9 : 4)}px`,
            height: '5px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: `top left`,
            zIndex: 90
        }}>
            <div style={{
                transform: `rotate(${45}deg)`,
            }} className='node-arrow z[99] w-[15px] h-[15px] border-r-4 border-t-4 rounded-tr-sm border-r-red-600 border-t-red-600 '>

            </div>
        </div>
    )
}
