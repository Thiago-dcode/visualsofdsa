"use client";
import Image from "next/image";
import { useDarkMode } from "@/context/darkModeContext";
export default function ImageComponent({
  image,
  alt,
}: {
  image: {
    light: string;
    dark: string;
  };
  alt: string;
}) {
  const { isDark } = useDarkMode();
  return <Image alt={alt} src={require(`@/assets/images/${isDark ? image.dark : image.light}`)} />;
}
