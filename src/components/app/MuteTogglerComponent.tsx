'use client'

import { useEffect } from "react";
import { Button } from "../ui/button"
import { useDarkMode } from "@/context/darkModeContext";
import { Volume2, VolumeX } from "lucide-react";
import { useMuted } from "@/context/muteContext";


const MuteComponent = () => {

    const { isMuted, toggleMuted } = useMuted();
    return (
        <div>
            {isMuted !== null && <Button variant={'no-style'} size={'icon'} onClick={() => {
                toggleMuted()
            }}>{isMuted ? <VolumeX size={30} className="dark:text-app-off-white text-app-off-black" /> : <Volume2 size={30} className="dark:text-app-off-white text-app-off-black" />}</Button>}

        </div>
    )

}

export default MuteComponent