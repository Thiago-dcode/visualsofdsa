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
  isLastNode: boolean;

}
export default function StaticArrayNodeComponent({ node, setAnimationRunning, isLastNode }: props) {
  const { createAnimation } = UseStaticArrayAnimation();
  const setRef = useCallback(async (ele: HTMLElement | null) => {

    if (!ele) return;
    node.ref = ele;
   if( node.isLastAdd) {
        await createAnimation(node, () => {
          setAnimationRunning(false)
          node.isLastAdd = false;
        })
      
    }
    // else if (action === 'insert' && node instanceof DynamicArrayNode && node.isLastInserted) {
    //   await createAnimation(node, () => {
    //   setAnimationRunning(false)
    //     node.isLastInserted = false;
    //   })
    // }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <LinearNodeComponent key={'LinearNodeComponent-'+node.id}  ref={(e) => {
      setRef(e)
    }} node={node} dsType='staticArray' className='h-full relative' />
  )
}
