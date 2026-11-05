import { useCallback, useEffect, useState } from "react";
import { speed } from "@/types";

export const useSpeed = (defaultSpeed: speed, localStorageKey: string) => {
  const [speed, setSpeed] = useState<speed>(defaultSpeed);

  const handleSetSpeed = useCallback(
    (speed: speed) => {
      localStorage.setItem(localStorageKey, speed.toString());
      setSpeed(speed);
    },
    [localStorageKey],
  );

  useEffect(() => {
    const storedSpeed = localStorage.getItem(localStorageKey);
    if (storedSpeed) {
      const parsedSpeed = parseInt(storedSpeed, 10) as speed;
      setSpeed(parsedSpeed);
    }
  }, [localStorageKey]);

  return {
    speed,
    handleSetSpeed,
  };
};
