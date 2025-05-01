'use client';

import { LinkItem } from "./type"
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LinkItemComponent({ link, icon, isFirstLvl, pathMatch, isLast = false, onNavigate = () => { } }: {
    link: LinkItem,
    isFirstLvl: boolean,
    icon?: React.ReactNode,
    pathMatch: boolean,
    isLast?: boolean,
    onNavigate?: () => void
}) {




    return (<div className={cn(' flex items-center justify-between  w-full', {
        'border-b-2 dark:border-b-app-off-white border-b-app-off-black  rounded-none': isFirstLvl && pathMatch,

    })}><Link href={link.enable ? link.link : '#'} className={cn("px-1 py-2 h-auto w-full", {
        'cursor-not-allowed dark:text-app-off-white-50 text-app-off-black-50 ': !link.enable,
        'cursor-default': link.enable && link.link === '#',
        'py-1 ': isFirstLvl
    })} onNavigate={() => {

        if (!link.enable || link.link === '#') return;
      
        onNavigate();

    }} >
            <span className={cn('flex items-center justify-between w-full gap-1 text-sm tablet:text-base', {
                'uppercase': isFirstLvl,
                'capitalize': !isFirstLvl

            })}> {link.name} {!link.enable ? <span className='text-xs text-gray-400 italic'> (Coming Soon)</span> : null} </span>
        </Link>



    </div>)
}