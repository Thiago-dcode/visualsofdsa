import React from 'react'
import { TreeObj } from '../../types'
import Arrow from '@/components/ui/arrow'
import BinaryTreeNode from '../../_classes/BinaryTreeNode'
import { Primitive } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'
import Node from '@/entities/data-structures/linear/_classes/Node'

type Props = {
    node: Node<Primitive>
    nodeShape: NodeShape,
}
function TreeNodeComponent({ node, nodeShape }: Props) {
    return (
        <>
            <div style={{
                width: nodeShape.nodeWidth + 'px',
                height: nodeShape.nodeHeight + 'px',
                left: node.position.x,
                top: node.position.y
            }} className='absolute border-2 rounded-full bg-white'>{node.data}</div>

        </>
    )
}

export default TreeNodeComponent