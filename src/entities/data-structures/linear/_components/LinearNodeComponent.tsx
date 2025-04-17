/* eslint-disable react/display-name */
import {
  forwardRef,
} from 'react'
import { Primitive } from '@/types';
import Node from '../_classes/Node';
import { cn, copyToClipboard } from '../../../../lib/utils';
import { config } from '@/config';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Dot } from 'lucide-react';
import HoverNodeCardContent from '@/components/container/CardContainer';

type props = {

  node: Node<Primitive>,
  style?: React.CSSProperties;
  dsType?: 'queue' | 'stack' | 'staticArray',
  className?: string,
  hoverContentStyle?: React.CSSProperties,

}
const LinearNodeComponent = forwardRef<HTMLDivElement, props>(({ node, dsType, style = {}, className = '',hoverContentStyle = {} }: props, ref) => {

  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger>
        <>
          {node && <div onClick={async () => {
            if (node.data) await copyToClipboard(node.data + '');
          }} ref={ref} id={`${dsType}-node-${node.id}-${node.data}`} style={style} className={cn('relative border-2  text-center flex items-center justify-center overflow-auto', config.darkModeTailwind, className, {
            'text-[rgb(226, 232, 240)]': node.data === null
          })}>
            <p className={cn({
              'text-app-bauhaus-blue font-semibold': node.data === null
            })}>
              {node.data !== null ? node.data : 'NULL'}
            </p>
          </div>}
        </>
      </HoverCardTrigger>
      <HoverNodeCardContent color={dsType === 'queue' ? 'green' : dsType === 'stack' ? 'yellow' : dsType === 'staticArray' ? 'blue' : 'red'} style={hoverContentStyle}>
        <p className='text-sm font-bold w-full text-center'>Node Info</p>
        <ul className='flex flex-col items-start justify-between w-full'>
          <li className='flex flex-row items-center justify-start gap-1'>
            <Dot size={16} />
            <p>Data: {node.data !== null ? `"${node.data}"` : 'NULL'}</p>
          </li>
          <li className='flex flex-row items-center justify-start gap-1'>
            <Dot size={16} />
            <p>Type: {dsType}</p>
          </li>
        </ul>
      </HoverNodeCardContent>
    </HoverCard>
  )
})
export default LinearNodeComponent;