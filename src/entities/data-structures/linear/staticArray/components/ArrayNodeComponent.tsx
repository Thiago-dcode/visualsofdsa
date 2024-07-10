import { Primitive } from '@/types'
import React, { useCallback } from 'react'
import Node from '../../_classes/Node';
import UseStaticArrayAnimation from '../hooks/UseStaticArrayAnimation';

type props = {
    node: Node<Primitive>;
    setAnimationRunning: (value: boolean) => void
}
export default function ArrayNodeComponent({ node, setAnimationRunning }: props) {
    const { createAnimation } = UseStaticArrayAnimation();
    const setRef = useCallback(async (ele: HTMLElement | null) => {
        if (!ele) return;
        node.ref = ele;
        await createAnimation(ele, () => {
            setAnimationRunning(false)
        })


    }, [])
    return (
        <p key={'arrayNode-' + node.id} ref={(e) => {
            setRef(e)
        }} className="border border-white w-full h-full flex items-center justify-center">
            {node.data ? node.data : 'NULL'}
        </p>
    )
}
