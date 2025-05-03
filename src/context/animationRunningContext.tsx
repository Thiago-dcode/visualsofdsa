'use client'
import { useToast } from "@/hooks/useToast";
import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from "react";

type AnimationRunningType = {
    isAnimationRunning: boolean,
    setAnimationRunning: (value: boolean) => void,
    isAnimationEnabled: boolean,
    setAnimationEnabled: (value: boolean) => void
}
const AnimationRunningContext = createContext<AnimationRunningType>({
    isAnimationRunning: false,
    setAnimationRunning: () => { },
    isAnimationEnabled: false,
    setAnimationEnabled: () => { }
})
export const useAnimationRunning = () => useContext(AnimationRunningContext);

export function AnimationRunningProvider({ children }: {
    children: ReactElement
}) {
    const { toastInfo } = useToast()
    const [isAnimationRunning, setisAnimationRunning] = useState<boolean>(false);
    const [isAnimationEnabled, setIsAnimationEnabled] = useState<boolean>(true);
    const setAnimationRunning = useCallback((value: boolean) => {
        setisAnimationRunning(value)
    }, [setisAnimationRunning])
    const setAnimationEnabled = useCallback((value: boolean) => {
        toastInfo(value ? 'Animations are enabled (function not implemented in all components)' : 'Animations are disabled (function not implemented in all components)');
        setIsAnimationEnabled(value)
    }, [setIsAnimationEnabled])
    useEffect(() => {
        setisAnimationRunning(false)
        setIsAnimationEnabled(true)
    }, [])

    return <AnimationRunningContext.Provider value={{
        isAnimationRunning,
        setAnimationRunning,
        isAnimationEnabled,
        setAnimationEnabled
    }}>
        {children}

    </AnimationRunningContext.Provider>
}

