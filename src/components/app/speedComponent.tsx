"use client"
import { Input } from '../ui/input'
import React, { useEffect } from 'react'

import { speed } from '@/types'


type SpeedProps = {

    title?: string,
    speed: speed,

    setSpeed: (speed: speed) => void
}
function SpeedComponent({ title = "Animation Speed", speed, setSpeed }: SpeedProps) {

    return (
        <div className='flex flex-col items-start justify-start'>
            <p>{title}</p>
            <Input value={speed} onChange={(e) => {
                const speed = parseInt(e.target.value)
                if (speed == 1 || speed == 2 || speed == 3 || speed == 4) {
                    setSpeed(speed)
                }
            }} type='range' min={1} max={4} />

        </div>
    )
}

export default SpeedComponent