import { Primitive } from '@/types'
import React, { useCallback } from 'react'
import Node from '../../_classes/Node';

type props = {
    node: Node<Primitive>;
}
export default function ArrayNodeComponent({ node }: props) {

    const setRef = useCallback((ele: HTMLElement | null) => {
        if (!ele) return;

        node.ref = ele;
        // handle some animation;


    }, [])
    return (
        <p key={'arrayNode-' + node.id} ref={(e) => {
            setRef(e)
        }} className="border border-white w-full h-full flex items-center justify-center">
            {node.data ? node.data : 'NULL'}
        </p>
    )
}
