import React from 'react'
type ArrowShape = {
    x: number,
    y: number,
    width: number,
    angle: number

}
type ArrowProps = {
    arrowShape: ArrowShape
}
export default function Arrow({ arrowShape }: ArrowProps) {
    const { x, y, width, angle } = arrowShape;
    console.log('ANGLE',angle)
    return (
        <div className='absolute bg-red-400 flex flex-row justify-end items-center' style={{
            margin: `0px ${angle===0?'5px':''}`,
            top: `${y}px`,
            left: `${x}px`,
            width: `${width-(angle ===0? 9:4)}px`,
            height: '3px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: `top left`,
            zIndex: 99
        }}>
            <div style={{
                transform: `rotate(${45}deg)`,
            }} className='z[99] w-[15px] h-[15px] border-r-4 border-t-4 rounded-tr-sm border-r-red-400 border-t-red-400 '>

            </div>
        </div>
    )
}
