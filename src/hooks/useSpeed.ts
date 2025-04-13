import { speed } from "@/types";

import { useEffect, useState } from "react";

export const useSpeed = (defaultSpeed: speed, localStorageKey: string) => {
  const [speed, setSpeed] = useState<speed>(defaultSpeed);
  
  const handleSetSpeed = (speed: speed) => {
    localStorage.setItem(localStorageKey, speed.toString());
    setSpeed(speed);
  };

  useEffect(() => {
    const storedSpeed = localStorage.getItem(localStorageKey);
    if (storedSpeed) {
      const parsedSpeed = parseInt(storedSpeed) as speed;
      setSpeed(parsedSpeed);
    }
  }, [localStorageKey]);

  return {
    speed,
    handleSetSpeed,
  };
};
