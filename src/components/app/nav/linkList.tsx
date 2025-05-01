'use client'
import LinkItemComponent from "./linkItem"
import { LinkItem } from "./type"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { ChevronUp } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import { useAnimationRunning } from "@/context/animationRunningContext"


export default function LinkList({ link, isFirstLvl, isLast = false }: {
    link: LinkItem,
    isFirstLvl: boolean,
    isLast?: boolean,
  
}) {
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
    const { children } = link
    const [isOpen, setIsOpen] = useState(false)
    const pathName = usePathname();
    const arrOfPaths = pathName.split('/')
    const pathMatch = arrOfPaths.includes(link.link.substring(1));
    const icon = useMemo(() => {
        if (!link.children || link.children.length === 0) return null
        if (isOpen && isFirstLvl) return <ChevronUp size={15} />;
        else if (!isOpen && isFirstLvl) return <ChevronDown size={15} />;
        else if (!isOpen && !isFirstLvl) return <ChevronRight size={15} />;
        else if (isOpen && !isFirstLvl) return <ChevronLeft size={15} />;
    }, [isOpen, isFirstLvl, link.children])

    const onNavigate = () => {
        if (isAnimationRunning) { setAnimationRunning(false) };

    }
   
    return (
        <>
            {!children ? <LinkItemComponent icon={icon} isLast={isLast} pathMatch={pathMatch} isFirstLvl={isFirstLvl} link={link} onNavigate={onNavigate} /> :
                < >

                    {
                        <HoverCard openDelay={100} closeDelay={100} onOpenChange={(e) => {
                            setIsOpen(e)
                        }}>
                            <div className="text-nowrap flex items-center justify-between w-full  gap-2 tablet:gap-4">
                                <LinkItemComponent onNavigate={onNavigate} isLast={isLast} pathMatch={pathMatch} isFirstLvl={isFirstLvl} icon={icon} link={link} />
                                <HoverCardTrigger href="#" className="cursor-pointer">
                                    {icon}
                                </HoverCardTrigger>
                            </div>
                            <HoverCardContent className="dark:bg-black border dark:border-app-off-white border-app-bg-black " align="start" side={isFirstLvl ? 'bottom' : 'right'}>

                                {children.map((child, i) => {
                                    const arr = child.link.split('/');

                                    const lastLink = arr[arr.length - 1];
                                    const firtsLink = arr[1];
                                    return (


                                        <div key={`${child.link}-${i}`} className={cn('border-b dark:border-app-off-white border-app-off-black', {
                                            'dark:bg-app-off-white bg-app-off-black dark:text-black text-white': arrOfPaths.includes(lastLink) && firtsLink === arrOfPaths[1],
                                            'border-none': children.length - 1 === i
                                        })} >

                                            <LinkList link={child} isFirstLvl={false} isLast={children.length - 1 === i} />


                                        </div>


                                    )
                                })}
                            </HoverCardContent>

                        </HoverCard>


                    }</>}
        </>
    )

}
