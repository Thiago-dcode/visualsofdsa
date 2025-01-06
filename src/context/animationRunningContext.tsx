'use client'
import { createContext, ReactElement, useContext, useEffect, useState } from "react";

type AnimationRunningType = {
    isAnimationRunning: boolean,
    setAnimationRunning: (value: boolean) => void
}
const AnimationRunningContext = createContext<AnimationRunningType>({
    isAnimationRunning: false,
    setAnimationRunning: () => { }
})
export const useAnimationRunning = () => useContext(AnimationRunningContext);

export function AnimationRunningProvider({ children }: {
    children: ReactElement
}) {
    const [isAnimationRunning, setisAnimationRunning] = useState<boolean>(false);
    const setAnimationRunning = (value: boolean) => {
        setisAnimationRunning(value)
    }
    useEffect(() => {
        setisAnimationRunning(false)
    }, [])

    return <AnimationRunningContext.Provider value={{
        isAnimationRunning,
        setAnimationRunning
    }}>
        {children}

    </AnimationRunningContext.Provider>
}

