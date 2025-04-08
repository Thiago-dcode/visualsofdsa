import React from 'react'
import { Primitive, Ref } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'

import { cn, copyToClipboard } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import TreeNode from '../../_classes/TreeNode'
import { animate } from '@/lib/animations'
import '@/entities/data-structures/non-linear/tree/animation.css'
type Props<T extends TreeNode<Primitive>> = {
    node: T
    nodeShape: NodeShape,
    onInsertAnimation?: (node: T) => Promise<void>
}
function TreeNodeComponent<K extends TreeNode<Primitive>>({ node, nodeShape, onInsertAnimation }: Props<K>) {
    const setRef = async (element: Ref) => {

        if (!element) return;
        node.ref = element
        if (onInsertAnimation && node.isLastAdd) await onInsertAnimation(node)
    }

    return (
        <HoverCard openDelay={100}>
            <HoverCardTrigger>
                <button onClick={async () => {
                    await copyToClipboard(node.data?.toString() || '')
                }} onMouseEnter={async () => {

                    if (node.ref) {
                        
                        await animate(node.ref, 'hover-node',0.5);
                       
                    }
                }} ref={(ref) => {
                    setRef(ref)
                }} style={{
                    width: nodeShape.nodeWidth + 'px',
                    height: nodeShape.nodeHeight + 'px',
                    left: node.position.x + 'px',
                    top: node.position.y + 'px',
                    zIndex: 1999
                }} className={cn('absolute border-2 dark:border-app-off-white border-app-off-black rounded-full dark:text-app-off-white text-app-off-black flex items-center justify-center font-semibold text-sm overflow-auto dark:bg-app-off-black bg-app-off-white', {
                    'text-xs': nodeShape.nodeWidth < 40,
                    'text-sm': nodeShape.nodeWidth >= 40 && nodeShape.nodeWidth <= 70,
                    'text-xl': nodeShape.nodeWidth > 70,
                })}><p>{node.data}</p></button>
            </HoverCardTrigger>
            <HoverCardContent style={{
                position: 'absolute',
                zIndex: 2000,
                left: node.position.x + 'px',
                top: (node.position.y + nodeShape.nodeHeight) + 'px',
            }} className="space-y-2">
                <div className="grid gap-2">
                    <div>
                        <h4 className="text-sm font-semibold">Node Info</h4>
                        <div className="text-sm text-muted-foreground">
                            <p><span className="font-medium">Value:</span> {node.data}</p>
                            <p><span className="font-medium">Position:</span> ({node.position.x}, {node.position.y})</p>
                            <p><span className="font-medium">Dimensions:</span> {nodeShape.nodeWidth}x{nodeShape.nodeHeight}px</p>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default TreeNodeComponent