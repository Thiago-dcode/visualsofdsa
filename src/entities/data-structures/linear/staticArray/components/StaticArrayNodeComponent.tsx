import { Primitive } from '@/types'
import React, { useCallback } from 'react'
import Node from '../../_classes/Node';
import UseStaticArrayAnimation from '../hooks/UseStaticArrayAnimation';
import LinearNodeComponent from '../../_components/LinearNodeComponent';
import { ArrayActions } from '../type';
import { DynamicArrayNode } from '../../dynamicArray/class/DynamicArrayNode';

type props = {
  node: Node<Primitive>;
  action?: ArrayActions;
  setAnimationRunning: (value: boolean) => void;
  isLastNode: boolean;
}
export default function StaticArrayNodeComponent({ node, action = 'create', setAnimationRunning, isLastNode }: props) {
  const { createAnimation } = UseStaticArrayAnimation();
  const setRef = useCallback(async (ele: HTMLElement | null) => {

    if (!ele) return;

    node.ref = ele;
    if (action === 'create') {

      await createAnimation(node, () => {
        setAnimationRunning(false)
      })
    }
    else if (action === 'push') {
      if (isLastNode) {
        await createAnimation(node, () => {
          setAnimationRunning(false)
        })
      }
    }
    else if (action === 'insert' && node instanceof DynamicArrayNode && node.isLastInserted) {


      console.log('INSERT ACTION: ', node)
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action])
  return (
    <LinearNodeComponent ref={(e) => {
      setRef(e)
    }} node={node} dsType='staticArray' className='h-full' />
  )
}
