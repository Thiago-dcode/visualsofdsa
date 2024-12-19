import { HoverCardTrigger, HoverCardContent, HoverCard } from '@/components/ui/hover-card';
import Node from '@/entities/data-structures/linear/_classes/Node'
import { cn, copyToClipboard } from '@/lib/utils';
import React, { useCallback } from 'react'

export default function Bar({ height, width = 20, node, className, left, bgColor, onRefSet }: {
  left: number,
  height: number,
  width?: number,
  node: Node<number>,
  className?: string,
  bgColor: string,
  onRefSet?: (node: Node<number>) => Promise<void>
}) {
  const setRef = useCallback(async (ref: HTMLElement | HTMLDivElement | null) => {
    node.position.x = left;
    if (!ref) return;
    node.ref = ref;
  
    if (onRefSet) await onRefSet(node)

  }, [node, left])

  return (
    <HoverCard openDelay={100} closeDelay={100} >
      <HoverCardTrigger onClick={async () => {
        await copyToClipboard(node.data + '');

      }} >
        <div style={{
          left: left,
          bottom: 0,
          height: Math.abs(height) + 'px',
          width: width + 'px',
          maxWidth: '80px',
          backgroundColor: bgColor

        }} ref={(e) => {
          setRef(e)
        }} className={cn('border  dark:border-app-off-white border-app-off-black absolute', className)}></div>
      </HoverCardTrigger>
      <HoverCardContent className='font-bold dark:bg-app-off-white bg-app-bg-black dark:text(-app-bg-black text-app-off-white'>
        <div>{node.data}</div>
      </HoverCardContent>
    </HoverCard>

  )
}
