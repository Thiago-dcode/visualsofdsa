import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';
import { Check, CircleAlert, CircleX } from "lucide-react";
import Nav from "@/components/app/nav";

import Image from "next/image";

import { config } from "@/config";
import DarkModeTogglerComponent from "@/components/app/DarkModeTogglerComponent";
import { DarkModeProvider } from "@/context/darkModeContext";
import LogoComponent from "@/components/app/logoComponent";
import { MuteProvider } from "@/context/muteContext";
import MuteComponent from "@/components/app/MuteTogglerComponent";
import { AnimationRunningProvider } from "@/context/animationRunningContext";
import ConfigSection from "@/components/app/ConfigSection";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "visualsofdsa",
  description: "Visuals of data structure and algorithms",
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className}${config.darkModeTailwind}`}>
        <AnimationRunningProvider>
          <DarkModeProvider>
            <MuteProvider>
              <div id="root">

                <header className=' top-0  right-0 z-50 py-2 mb-8 border-b-2 dark:border-b-app-off-white border-b-app-off-black dark:bg-app-off-black/80 bg-app-off-white/70 w-full'>
                  <div className=" flex items-end justify-between px-[30px] w-full ">

                    <LogoComponent />
                    <Nav />

                    <ConfigSection />

                  </div>

                </header>

                {children}

              </div>
            </MuteProvider>
          </DarkModeProvider>
        </AnimationRunningProvider>
        <Toaster

          toastOptions={{

            classNames: {
              error: 'bg-red-500 text-white font-bold text-md',
              success: 'bg-green-500 text-white font-bold text-md ',
              warning: 'bg-yellow-500 text-white font-bold text-md',
              info: 'bg-blue-500 text-white font-bold text-md',
            },
          }}
          icons={{
            success: <Check />,
            warning: <CircleAlert />,
            error: <CircleX />,

          }}

        />
      </body>
    </html>
  );
}
