'use client'

import { config } from "@/config";
import { createContext, ReactElement, useContext, useEffect, useState } from "react";

type Muted = {
    isMuted: boolean | null,
    toggleMuted: () => void
}
const MuteContext = createContext<Muted>({
    isMuted: false,
    toggleMuted: () => { }
})
export const useMuted = () => useContext(MuteContext);

export function MuteProvider({ children }: {
    children: ReactElement
}) {
    const [isMuted, setIsMuted] = useState<null | boolean>(null);
    const toggleMuted = () => {
        if (isMuted === null) return;
        setIsMuted(prev => !prev)
    }
    useEffect(() => {
        if (document) {
            const muted = localStorage.getItem(config.localStorageKeys.muted);
            if (muted === null) localStorage.setItem(config.localStorageKeys.muted, '0')
            setIsMuted(muted == '1');
        }
    }, [])
    useEffect(() => {
        if (isMuted === null) return;
        localStorage.setItem(config.localStorageKeys.muted, isMuted ? '1' : '0')

    }, [isMuted])

    return <MuteContext.Provider value={{
        isMuted,
        toggleMuted
    }}>
        {children}

    </MuteContext.Provider>
}

