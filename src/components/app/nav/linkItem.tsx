'use client';

import { LinkItem } from "./type"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

export default function LinkItemComponent({ link, icon, isFirstLvl, pathMatch }: {
    link: LinkItem,
    isFirstLvl: boolean,
    icon?: 'up' | 'down' | 'right' | 'left',
    pathMatch: boolean
}) {

    const getIcon = () => {
        if (!icon) return null;
        switch (icon) {
            case 'down':

                return <ChevronDown size={15} />;
            case 'up':

                return <ChevronUp size={15} />;
            case 'right':

                return <ChevronRight size={15} />;
            case 'left':

                return <ChevronLeft size={15} />;
            default:

                return null;
        }
    }


    const router = useRouter();

    // console.log(arrOfPaths);
    return (<div className={cn(' flex items-center justify-between  w-full', {
        'border-b-2 dark:border-b-app-off-white border-b-app-off-black  rounded-none': isFirstLvl && pathMatch,


    })}><Button className={cn("px-1 py-2 h-auto w-full", {
        'cursor-not-allowed dark:text-app-off-white/50 text-app-off-black/50 ': !link.enable
    })} variant={'no-style'} onClick={() => {
        if (!link.enable || link.link === '#') return;
        router.push(link.link)
    }} >
            <span className={cn('flex items-center justify-between w-full gap-1', {
                'uppercase': isFirstLvl,
                'capitalize': !isFirstLvl

            })}> {link.name}  {getIcon()} </span>
        </Button>



    </div>)
}