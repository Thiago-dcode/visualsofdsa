import HoverNodeCardContent from '@/components/container/CardContainer';
import { HoverCardTrigger, HoverCardContent, HoverCard } from '@/components/ui/hover-card';
import Node from '@/entities/data-structures/linear/_classes/Node'
import { cn, copyToClipboard } from '@/lib/utils';
import { Dot } from 'lucide-react';
import React, { useCallback } from 'react'

export default function Bar({ height, bottom, width = 20, node, className, left, bgColor, maxBarSize }: {
  left: number,
  bottom: number,
  height: number,
  width?: number,
  node: Node<number>,
  className?: string,
  bgColor: string,
  maxBarSize: number

}) {
  const setRef = useCallback(async (ref: HTMLElement | HTMLDivElement | null) => {
    node.position.x = left;
    node.color =bgColor;
    if (!ref) return;
    node.ref = ref;



  }, [])

  return (
    <HoverCard openDelay={100} closeDelay={100} >
      <HoverCardTrigger onClick={async () => {
        await copyToClipboard(node.data + '');

      }} >
        <div style={{
          left,
          bottom,
          height: Math.abs(height) + 'px',
          width: width + 'px',
          maxWidth: '80px',
          backgroundColor: bgColor

        }} ref={(e) => {
          setRef(e)
        }} className={cn('border  dark:border-app-off-white border-app-off-black absolute', className)}></div>
      </HoverCardTrigger>
      <HoverNodeCardContent color={'green'}  
      style={{
        position: 'relative',
       top: `${maxBarSize - height}px`,
        left: `${left}px`,
    
      }}>
        <p className='text-sm font-bold w-full text-center'>Node Info</p>
        <ul className='flex flex-col items-start justify-between w-full'>
          <li className='flex flex-row items-center justify-start gap-1'>
            <Dot size={16} />
            <p>Data: {node.data !== null ? typeof node.data === 'number' ? node.data : `"${node.data}"` : 'NULL'}</p>
          </li>
        </ul>
      </HoverNodeCardContent>
    </HoverCard>

  )
}
