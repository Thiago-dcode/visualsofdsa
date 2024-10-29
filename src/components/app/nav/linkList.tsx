'use client'
import { Separator } from "@/components/ui/separator"
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
                            <HoverCardContent className="bg-app-bg text-white" align="start" side={isFirstLvl ? 'bottom' : 'right'}>

                                {children.map((child, i) => {
                                    const arr = child.link.split('/');
                                   const lastLink   = arr[arr.length-1];
                                        
                                    return (


                                        <div key={`${child.link}-${i}`} className={cn({
                                            'bg-white/80 text-black':arrOfPaths.includes(lastLink)
                                        })} >

                                            <LinkList link={child} isFirstLvl={false} />
                                            <Separator />

                                        </div>


                                    )
                                })}
                            </HoverCardContent>

                        </HoverCard>


                    }</>}
        </>
    )

}
