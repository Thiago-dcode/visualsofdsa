import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from 'sonner';
import { Check, CircleAlert, CircleX } from "lucide-react";
import Nav from "@/components/app/nav";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Logo from '@/assets/images/logo.png'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "visualsofdsa",
  description: "Visuals of data structure and algorithms",
  icons:{
    icon:'/favicon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <div id="root">

          <header className='sticky top-0 z-50 py-8 bg-app-bg '>
           <div className=" flex items-end justify-between px-10">
            
            <Link href={'/'} className=""><Image alt="visuals of dsa logo" height={65} width={65} src={Logo}/></Link>
           <Nav/>
           
           </div>
           <Separator color="white"/>
          </header>
        
          {children}
          
          </div>
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
