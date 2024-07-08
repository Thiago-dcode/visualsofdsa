import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

function ButtonAction({ isLoading, onClick, title, className = '' }: {
    isLoading: boolean,
    onClick: () => void,
    title: string,
    className?: string

}) {
    return (
        <Button style={{
            opacity: isLoading ? '0.4' : '1',
            cursor: isLoading ? 'wait' : 'pointer'
        }} onClick={() => {
            onClick();
        }} type="submit" className={cn("", className)} variant={"default"}>{title}</Button>
    )
}

export default ButtonAction