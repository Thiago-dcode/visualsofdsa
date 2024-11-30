import { HoverCardTrigger, HoverCardContent, HoverCard } from '@/components/ui/hover-card';
import Node from '@/entities/data-structures/linear/_classes/Node'
import { cn, copyToClipboard } from '@/lib/utils';
import React, { useCallback } from 'react'
import { toast } from 'sonner';

export default function Bar({ height, width = 20, node,className }: {
  height: number,
  width?: number,
  node: Node<number>,
  className?:string
}) {
  const setRef = useCallback((ref: HTMLElement | HTMLDivElement | null) => {
    if (!ref) return;
    node.ref = ref;
  }, [node])
  return (
    <HoverCard  openDelay={100} closeDelay={100} >
      <HoverCardTrigger onClick={async()=>{
        await copyToClipboard(node.data +'');
    
      }} >
        <div style={{
          height: Math.abs(height) + 'px',
          width: width + 'px',

        }} ref={setRef} className={cn('border  dark:border-app-off-white border-app-off-black',className)}></div>
      </HoverCardTrigger>
      <HoverCardContent className='w-fit font-bold dark:bg-app-off-white bg-app-bg-black dark:text-app-bg-black text-app-off-white'>
        <div>{node.data}</div>
      </HoverCardContent>
    </HoverCard>

  )
}
