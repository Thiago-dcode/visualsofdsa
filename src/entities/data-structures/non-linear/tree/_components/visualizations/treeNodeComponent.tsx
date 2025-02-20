import React from 'react'
import { Primitive, Ref } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'
import Node from '@/entities/data-structures/linear/_classes/Node'

type Props< T extends Node<Primitive>> = {
    node: T
    nodeShape: NodeShape,
    onInsertAnimation?: (node: T) => Promise<void>
}
function TreeNodeComponent< K extends Node<Primitive>>({ node, nodeShape, onInsertAnimation }: Props<K>) {

    const setRef = async (element: Ref) => {
    
        if (!element) return;
        node.ref = element
        if (onInsertAnimation && node.isLastAdd) await onInsertAnimation(node)
    }
    return (
        <>
            <div ref={(ref) => {
                setRef(ref)
            }} style={{
                width: nodeShape.nodeWidth + 'px',
                height: nodeShape.nodeHeight + 'px',
                left: node.position.x + 'px',
                top: node.position.y + 'px'
            }} className='absolute border-2 rounded-full bg-white text-black flex items-center justify-center'><p>{node.data}</p></div>

        </>
    )
}

export default TreeNodeComponent