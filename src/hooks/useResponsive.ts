import { useState, useEffect, useCallback, useRef } from "react";

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
  isLaptop: boolean;
  isDesktop: boolean;
  isTv: boolean;
  width: number;
  height: number;
  twResponsive: {
    phone: boolean;
    tablet: boolean;
    laptop: boolean;
    desktop: boolean;
    tv: boolean;
  },
};

function useResponsive(onResize = (e: UIEvent, device: Device, sizeChanged: {
  width: boolean,
  height: boolean
}) => { }) {
  const prevSize = useRef<{
    width: number,
    height: number
  }>({
    width: 0,
    height: 0
  })
  const _setDevice: (width: number, height: number) => Device = useCallback(
    (width: number, height: number) => ({
      isPhone: width <= 480,
      isTablet: width > 480 && width <= 860,
      isLaptop: width > 860 && width <= 1024,
      isDesktop: width > 1024 && width <= 1440,
      isTv: width > 1440,
      twResponsive: {
        phone: width <= 480,
        tablet: width <= 860,
        laptop: width <= 1024,
        desktop: width <= 1440,
        tv: width <= 1800,
      },
      width,
      height,
    }),
    []
  );
  const [device, setDevice] = useState<Device>({
    isPhone: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false,
    isTv: false,
    height: 0,
    width: 0,
    twResponsive: {
      phone: false,
      tablet: false,
      laptop: false,
      desktop: false,
      tv: false,
    }
  });

  const handleResize = useCallback(
    debounce((e: UIEvent) => {
      const device = _setDevice(window.innerWidth, window.innerHeight);
      onResize(e, device, {
        width: prevSize.current.width !== device.width,
        height: prevSize.current.height !== device.height
      });
      prevSize.current = {
        width: device.width,
        height: device.height
      }
      setDevice(device);
    }, 100),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDevice(_setDevice(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return device;
}

export default useResponsive;
