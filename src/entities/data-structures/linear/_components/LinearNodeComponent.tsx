/* eslint-disable react/display-name */
import {
  forwardRef,
} from 'react'
import { Primitive } from '@/types';
import Node from '../_classes/Node';
import { cn } from '../../../../lib/utils';

type props = {

  node: Node<Primitive>,
  style?: React.CSSProperties;
  dsType?: 'queue' | 'stack' | 'staticArray',
  className?: string

}
const LinearNodeComponent = forwardRef<HTMLDivElement, props>(({ node, dsType, style = {}, className = '' }: props, ref) => {


  return (
    <>
      {node && <div ref={ref} id={`${dsType}-node-${node.id}`} style={style} className={cn('border-4 border-white text-center flex items-center justify-center overflow-auto ', className)}>
        <p style={
          {
            color: node.data === null ? 'rgba(59, 130, 246,0.8)' : 'rgb(226, 232, 240)'
          }
        }>
          {node.data !== null ? node.data : 'NULL'}
        </p>
      </div>}

    </>
  )
})
export default LinearNodeComponent;