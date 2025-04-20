'use client'
import { Button } from "../ui/button"
import { useDarkMode } from "@/context/darkModeContext";
import { Moon, Sun } from "lucide-react";


const DarkLightComponent = () => {

    const {isDark,toggleDarkMode} = useDarkMode();
    return (
        <div>
            {isDark !==null && <Button variant={'no-style'} size={'icon'} onClick={()=>{
                toggleDarkMode()
            }}>{!isDark ? <Sun className="w-6 h-6 md:w-7 md:h-7" color="black"/> : <Moon className="w-6 h-6 md:w-7 md:h-7" color="white"/>}</Button>}

        </div>
    )

}

export default DarkLightComponent