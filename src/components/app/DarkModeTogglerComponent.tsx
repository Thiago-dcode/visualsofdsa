'use client'

import { useEffect } from "react";
import { Button } from "../ui/button"
import { useDarkMode } from "@/context/darkModeContext";
import { Moon, Sun } from "lucide-react";


const DarkLightComponent = () => {

    const {isDark,toggleDarkMode} = useDarkMode();
    return (
        <div>
            {isDark !==null && <Button variant={'no-style'} size={'icon'} onClick={()=>{
                toggleDarkMode()
            }}>{!isDark ? <Sun size={30}   color="black"/> : <Moon size={30} color="white"/>}</Button>}

        </div>
    )

}

export default DarkLightComponent