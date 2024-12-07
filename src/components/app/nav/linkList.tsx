'use client'
import LinkItemComponent from "./linkItem"
import { LinkItem } from "./type"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"



export default function LinkList({ link, isFirstLvl }: {
    link: LinkItem,
    isFirstLvl: boolean
}) {
    const { children } = link
    const [isOpen, setIsOpen] = useState(false)
    const pathName = usePathname();
    const arrOfPaths = pathName.split('/')
   const pathMatch = arrOfPaths.includes(link.link.substring(1));
    const getIcon = () => {

        if (isOpen && isFirstLvl) return 'up';
        else if (!isOpen && isFirstLvl) return 'down';
        else if (!isOpen && !isFirstLvl) return 'right';
        else if (isOpen && !isFirstLvl) return 'left';

    }
    return (
        <>
            {!children ? <LinkItemComponent pathMatch={pathMatch}  isFirstLvl={isFirstLvl} link={link} /> :
                < >

                    {


                        <HoverCard onOpenChange={(e) => {
                            setIsOpen(e)
                        }} closeDelay={0} openDelay={0}>
                            <HoverCardTrigger className="flex items-center justify-start"> <LinkItemComponent  pathMatch={pathMatch} isFirstLvl={isFirstLvl} icon={getIcon()} link={link} /> </HoverCardTrigger>
                            <HoverCardContent className="dark:bg-black border dark:border-app-off-white border-app-bg-black " align="start" side={isFirstLvl ? 'bottom' : 'right'}>

                                {children.map((child, i) => {
                                    const arr = child.link.split('/');
                                
                                   const lastLink   = arr[arr.length-1];
                                   const firtsLink = arr[1];
                                    return (


                                        <div key={`${child.link}-${i}`} className={cn('border-b dark:border-app-off-white border-app-off-black',{ 
                                            'dark:bg-app-off-white bg-app-off-black dark:text-black text-white':arrOfPaths.includes(lastLink) && firtsLink === arrOfPaths[1]
                                        })} >

                                            <LinkList link={child} isFirstLvl={false} />
                                           

                                        </div>


                                    )
                                })}
                            </HoverCardContent>

                        </HoverCard>


                    }</>}
        </>
    )

}
