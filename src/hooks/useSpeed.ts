import { speed } from "@/types";

import { useEffect, useState } from "react";

export const useSpeed = (defaultSpeed: speed, localStorageKey: string) => {
  const [speed, setSpeed] = useState<speed>(defaultSpeed);
  const handleSetSpeed = (speed: speed) => {
    localStorage.setItem(localStorageKey, speed.toString());
    setSpeed(speed);
  };
  useEffect(() => {
    if (!window) return;
    const speed = localStorage.getItem(localStorageKey)
      ? (parseInt(localStorage.getItem(localStorageKey)!) as speed)
      : null;
    if (speed) setSpeed(speed);
  }, []);

  return {
    speed,
    handleSetSpeed,
  };
};
