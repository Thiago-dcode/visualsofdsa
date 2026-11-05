"use client";
import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/context/darkModeContext";
import { Button } from "../ui/button";

const DarkLightComponent = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  return (
    <div>
      {isDark !== null && (
        <Button
          variant={"no-style"}
          size={"icon"}
          onClick={() => {
            toggleDarkMode();
          }}
        >
          {!isDark ? (
            <Sun className="w-6 h-6 md:w-7 md:h-7" color="black" />
          ) : (
            <Moon className="w-6 h-6 md:w-7 md:h-7" color="white" />
          )}
        </Button>
      )}
    </div>
  );
};

export default DarkLightComponent;
