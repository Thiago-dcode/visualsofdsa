import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { ButtonActionType } from '@/types';
import { useMemo } from 'react';


function ButtonAction({ isLoading, onClick, title, className = '',action }: {
    isLoading: boolean,
    onClick: () => void,
    title: string,
    className?: string,
    action: ButtonActionType

}) {
    const style = useMemo(() => {
        return {
            opacity: isLoading ? '0.4' : '1',
            cursor: isLoading ? 'wait' : 'pointer'
        }
    }, [isLoading])
    return (
        <Button  style={style} onClick={async () => {
            onClick();
        }} type="submit" className={cn("text-app-off-white font-bold tracking-wider text-xs tablet:text-sm p-0 px-3 h-8 ", className,{
           'bg-app-bauhaus-green hover:bg-app-bauhaus-green/80': action ==='write',
           'bg-app-bauhaus-red hover:bg-app-bauhaus-red/80': action ==='delete',
           'bg-app-bauhaus-yellow hover:bg-app-bauhaus-yellow/80 text-app-off-black': action ==='read',
           'bg-app-bauhaus-blue hover:bg-app-bauhaus-blue/80': action ==='search',
           'bg-app-bauhaus-orange hover:bg-app-bauhaus-orange/80': action ==='insert',
           'bg-app-bauhaus-indigo hover:bg-app-bauhaus-indigo/80': action ==='fill',
        })} variant={"no-style"} size={"fit"}>{title}</Button>
    )
}

export default ButtonAction