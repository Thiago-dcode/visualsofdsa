'use client'

import { createContext, ReactElement, useContext, useEffect, useState } from "react";

type DarkMode = {
    isDark: boolean | null,
    toggleDarkMode: () => void
}
const DarkModeContext = createContext<DarkMode>({
    isDark: false,
    toggleDarkMode: () => { }
})
export const useDarkMode = () => useContext(DarkModeContext);
export function DarkModeProvider({ children }: {
    children: ReactElement
}) {
    const [isDark, setIsDark] = useState<null | boolean>(null);
    const toggleDarkMode = () => {
        if (!document) return;
        document.documentElement.classList.toggle('dark')
        setIsDark(document.documentElement.classList.contains('dark'))

    }
    useEffect(() => {
        if (document) {
            const theme = localStorage.getItem('theme');
            if (theme) {
                setIsDark(theme === 'dark');
                return;
            }
            setIsDark(document.documentElement.classList.contains('dark') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        }
    }, [])
    useEffect(() => {

        if (isDark === null) return;
        if (isDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
        }



    }, [isDark])

    return <DarkModeContext.Provider value={{
        isDark,
        toggleDarkMode
    }}>

        {children}

    </DarkModeContext.Provider>
}

