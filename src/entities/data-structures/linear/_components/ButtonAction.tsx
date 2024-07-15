import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function ButtonAction({ isLoading, onClick, title, className = '' }: {
    isLoading: boolean,
    onClick: () => void,
    title: string,
    className?: string

}) {
    const style = useMemo(() => {
        return {
            opacity: isLoading ? '0.4' : '1',
            cursor: isLoading ? 'wait' : 'pointer'
        }
    }, [isLoading])
    return (
        <Button style={style} onClick={async () => {
            onClick();
        }} type="submit" className={cn("", className)} variant={"default"}>{title}</Button>
    )
}

export default ButtonAction