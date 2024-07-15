import { Primitive } from '@/types'
import React, { useCallback } from 'react'
import Node from '../../_classes/Node';
import UseStaticArrayAnimation from '../hooks/UseStaticArrayAnimation';
import LinearNodeComponent from '../../_components/LinearNodeComponent';

type props = {
  node: Node<Primitive>;
  action?: 'create' | 'write';
  setAnimationRunning: (value: boolean) => void
}
export default function StaticArrayNodeComponent({ node, action = 'create', setAnimationRunning }: props) {
  const { createAnimation } = UseStaticArrayAnimation();
  const setRef = useCallback(async (ele: HTMLElement | null) => {
  
       if (!ele || action !== 'create') return;
    node.ref = ele;
   
  
    await createAnimation(node, () => {
      setAnimationRunning(false)
    })


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action])
  return (
    <LinearNodeComponent ref={(e) => {
      setRef(e)
    }} node={node} dsType='staticArray' className='h-full' />
  )
}
