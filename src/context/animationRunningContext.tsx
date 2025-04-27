'use client'
import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from "react";

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
    const setAnimationRunning = useCallback((value: boolean) => {
        setisAnimationRunning(value)
    }, [setisAnimationRunning])
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

