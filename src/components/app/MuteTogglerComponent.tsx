'use client'
import { Button } from "../ui/button"
import { Volume2, VolumeX } from "lucide-react";
import { useMuted } from "@/context/muteContext";

const MuteComponent = () => {

    const { isMuted, toggleMuted } = useMuted();
    return (
        <div>
            {isMuted !== null && <Button variant={'no-style'} size={'icon'} onClick={() => {
                toggleMuted()
            }}>{isMuted ? <VolumeX className="dark:text-app-off-white text-app-off-black w-6 h-6 md:w-7 md:h-7" /> : <Volume2 className="w-6 h-6 md:w-7 md:h-7 dark:text-app-off-white text-app-off-black" />}</Button>}

        </div>
    )

}

export default MuteComponent