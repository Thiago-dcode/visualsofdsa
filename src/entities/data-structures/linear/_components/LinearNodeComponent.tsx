/* eslint-disable react/display-name */
import {
  forwardRef,
} from 'react'
import { Primitive } from '@/types';
import Node from '../_classes/Node';

type props = {

  node: Node<Primitive>,

  height: number,
  dsType?: 'queue' | 'stack',

}
const LinearNodeComponent = forwardRef<HTMLDivElement, props>(({ node, height, dsType = 'stack' }: props, ref) => {


  return (
    <>
      {node && <div ref={ref} id={`${dsType}-node-${node.id}`} style={
        {
          top: dsType == 'queue' ? `${node.position.y}px` : '',
          bottom: dsType == 'stack' ? `${node.position.y}px` : '',
          height: `${height}px`,

        }
      } className="linear-node text-center flex items-center justify-center overflow-auto rounded-lg">
        {node.data}
      </div>}

    </>
  )
})
export default LinearNodeComponent;