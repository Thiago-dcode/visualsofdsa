import { useState, useEffect, useCallback } from "react";
type Device = {
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTv: boolean;
  width: number;
  height: number;
};
function useResponsive(onResize = (e:UIEvent)=>{}) {
  const checkDevice = useCallback(
    (width: number, height: number) => ({
      isPhone: width <= 480,
      isTablet: width > 480 && width <= 860,
      isDesktop: width > 860 && width <= 1200,
      isTv: width > 1200,
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

  const handleResize = useCallback((e:UIEvent) => {
    onResize(e)
    setDevice(checkDevice(window.innerWidth, window.innerHeight));
  }, []);

  useEffect(() => {
    if (!window) return;
    setDevice(checkDevice(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}

export default useResponsive;
