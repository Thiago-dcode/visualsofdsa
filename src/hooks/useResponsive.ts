import { useState, useEffect, useCallback } from "react";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

type Device = {
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTv: boolean;
  width: number;
  height: number;
};

function useResponsive(onResize = (e: UIEvent, device: Device) => { }) {
  const checkDevice = useCallback(
    (width: number, height: number) => ({
      isPhone: width <= 480,
      isTablet: width > 480 && width <= 860,
      isDesktop: width > 860 && width <= 1300,
      isTv: width > 1300,
      width,
      height,
    }),
    []
  );
  const [device, setDevice] = useState<Device>({
    isPhone: false,
    isDesktop: false,
    isTablet: false,
    isTv: false,
    height: 0,
    width: 0,
  });

  const handleResize = useCallback(
    debounce((e: UIEvent) => {
      const device = checkDevice(window.innerWidth, window.innerHeight);
      onResize(e, device);
      setDevice(device);
    }, 100),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDevice(checkDevice(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return device;
}

export default useResponsive;
