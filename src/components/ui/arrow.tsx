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
    return (
        <div className='absolute bg-red-600 flex flex-row justify-end items-center' style={{
            top: `${y}px`,
            left: `${x}px`,
            width: `${width}px`,
            height: '5px',
            transform: `rotate(${angle}deg)`,
            transformOrigin: `top left`,
            zIndex: 99
        }}>
<div style={{
    transform: `rotate(${45}deg)`,
}} className='z[99] w-[20px] h-[20px] border-r-4 border-t-4 border-r-red-600 border-t-red-600 '>

</div>
        </div>
    )
}
