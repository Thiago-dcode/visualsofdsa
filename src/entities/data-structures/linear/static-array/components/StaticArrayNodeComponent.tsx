import { Primitive } from '@/types'
import React, { useCallback } from 'react'
import Node from '../../_classes/Node';
import UseStaticArrayAnimation from '../hooks/UseStaticArrayAnimation';
import LinearNodeComponent from '../../_components/LinearNodeComponent';
import { ArrayActions } from '../type';
import { DynamicArrayNode } from '../../dynamic-array/class/DynamicArrayNode';

type props = {
  node: Node<Primitive>;
  setAnimationRunning: (value: boolean) => void;

}
export default function StaticArrayNodeComponent({ node, setAnimationRunning }: props) {
  const { createAnimation } = UseStaticArrayAnimation(2);
  const setRef = useCallback(async (ele: HTMLElement | null) => {

    if (!ele) return;
    node.ref = ele;
   if( node.isLastAdd) {
        await createAnimation(node, () => {
          setAnimationRunning(false)
          node.isLastAdd = false;
        })
      
    }
  }, [])
  return (
    <LinearNodeComponent key={'LinearNodeComponent-'+node.id}  ref={(e) => {
      setRef(e)
    }} node={node} dsType='staticArray' className='h-full relative' />
  )
}
