import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';
import { Check, CircleAlert, CircleX } from "lucide-react";
import Nav from "@/components/app/nav";

import { config } from "@/config";
import { DarkModeProvider } from "@/context/darkModeContext";
import LogoComponent from "@/components/app/logoComponent";
import { MuteProvider } from "@/context/muteContext";
import { AnimationRunningProvider } from "@/context/animationRunningContext";
import ConfigSection from "@/components/app/ConfigSection";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import Main from "@/components/container/Main";
import Footer from "@/components/app/Footer";
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
              <div id="root" className="h-screen">

                <header className=' top-0 right-0 z-50 py-2  border-b-2 dark:border-b-app-off-white border-b-app-off-black dark:bg-app-off-black/80 bg-app-off-white/70 w-full'>
                  <div className=" flex items-center justify-between px-3 phone:px-[30px] w-full ">

                    <div className='hidden phone:block'> <LogoComponent /></div>
                    <Nav />
                    <div className='phone:hidden'> <LogoComponent /></div>
                    <ConfigSection />

                  </div>

                </header>

                <Main>
                  <Suspense fallback={<Loader />}>
                    {children}
                  </Suspense>
                </Main>
                <Footer />
              </div>
            </MuteProvider>
          </DarkModeProvider>
        </AnimationRunningProvider>
        <Toaster

          toastOptions={{

            classNames: {
              error: 'bg-app-bauhaus-red text-white font-bold text-md',
              success: 'bg-app-bauhaus-green text-white font-bold text-md ',
              warning: 'bg-app-bauhaus-yellow text-white font-bold text-md',
              info: 'bg-app-bauhaus-blue text-white font-bold text-md',
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
