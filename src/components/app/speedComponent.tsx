"use client"
import { Input } from '../ui/input'
import React from 'react'

import { speed } from '@/types'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { cn } from '@/lib/utils'


type SpeedProps = {

    title?: string,
    speed: speed,

    setSpeed: (speed: speed) => void
}
function SpeedComponent({ title = "Animation Speed", speed, setSpeed }: SpeedProps) {

    const { isAnimationEnabled } = useAnimationRunning()

    return (
        <div className={cn('flex flex-col items-start justify-start', {
            'opacity-50': !isAnimationEnabled
        })}>
            <p>{title}</p>
            <Input value={speed} onChange={(e) => {
                if (!isAnimationEnabled) return;
                const speed = parseInt(e.target.value)
                if (speed == 1 || speed == 2 || speed == 3 || speed == 4) {
                    setSpeed(speed)
                }
            }} type='range' min={1} max={4} />

        </div>
    )
}

export default SpeedComponent