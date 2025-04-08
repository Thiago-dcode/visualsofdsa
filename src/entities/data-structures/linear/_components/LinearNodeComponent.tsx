/* eslint-disable react/display-name */
import {
  forwardRef,
} from 'react'
import { Primitive } from '@/types';
import Node from '../_classes/Node';
import { cn, copyToClipboard } from '../../../../lib/utils';
import { config } from '@/config';

type props = {

  node: Node<Primitive>,
  style?: React.CSSProperties;
  dsType?: 'queue' | 'stack' | 'staticArray',
  className?: string

}
const LinearNodeComponent = forwardRef<HTMLDivElement, props>(({ node, dsType, style = {}, className = '' }: props, ref) => {


  return (
    <>
      {node && <div onClick={async()=>{
        if(node.data)  await copyToClipboard(node.data+ '');
      }} ref={ref} id={`${dsType}-node-${node.id}-${node.data}`} style={style} className={cn(' relative border-2  text-center flex items-center justify-center overflow-auto', config.darkModeTailwind, className,{
           'text-[rgb(226, 232, 240)]' :node.data === null
      })}>
        <p className={cn({
         'text-app-bauhaus-blue font-semibold' :node.data === null
        })}>
          {node.data !== null ? node.data : 'NULL'}
        </p>
      </div>}

    </>
  )
})
export default LinearNodeComponent;