import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { links } from "@/config";
import { Toaster } from 'sonner';
import { Check, CircleAlert, CircleX } from "lucide-react";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "visualsofdsa",
  description: "Visuals of data structure and algorithms",
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


          <header className='flex flex-row items-center justify-between sticky top-0 z-50 py-8'>
            <nav className='top-nav w-full flex items-center justify-center'>
              <ul className='flex items-center  border-2 border-white justify-evenly gap-10 px-10 uppercase'>

                {Object.entries(links).map(([key, value], i) => {

                  return (

                    <li key={key + value + i}>
                      <Link href={`/${key}`}>{key}</Link>
                    </li>
                  )
                })}
              </ul>

            </nav>
          </header>

          {children}</div>
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
