'use client'
import DarkModeTogglerComponent from './DarkModeTogglerComponent'
import MuteComponent from './MuteTogglerComponent'
import { useAnimationRunning } from '@/context/animationRunningContext'

export default function ConfigSection() {
    const { isAnimationRunning } = useAnimationRunning()
    return (
        <div className="flex items-center justify-center gap-2 w-20">
            {!isAnimationRunning ?
                <>
                    <DarkModeTogglerComponent />
                    <MuteComponent />
                </> : <div></div>}
        </div>
    )
}
