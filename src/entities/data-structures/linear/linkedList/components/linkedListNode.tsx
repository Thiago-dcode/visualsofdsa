import React, { useCallback } from 'react'
import LinkedListNode from '../classes/LinkedListNode'
import { Primitive } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'
import { getAngle, getEuclideanDistance, getMemoryAdress } from '@/lib/utils'
import { X } from 'lucide-react'
import Arrow from '@/components/ui/arrow'

type LinkedListNodeProps = {
    node: LinkedListNode<Primitive>,
    nodeShape: NodeShape,
    index: number,
    isHead?: boolean,
    isTail?: boolean,
}

export default function LinkedListNodeComponent({ node, nodeShape, index, isHead = false, isTail = false }: LinkedListNodeProps) {
    const handleRef = useCallback((element: HTMLElement | HTMLDivElement | null) => {
        if (!element) return
        node.ref = element;
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getArrowShape = () => {
        if (!node.next) return {
            x: 0,
            y: 0,
            width: 0,
            angle: 0
        }
        const nodeStartPosition = {
            x: node.position.x + nodeShape.nodeWidth,
            y: node.position.y + nodeShape.nodeHeight / 2
        }
        const nodeNextPosition = {
            x: node.next.position.x,
            y: node.next.position.y + nodeShape.nodeHeight / 2
        }
    
        const width =  getEuclideanDistance(nodeStartPosition, nodeNextPosition);
     
        const angle = getAngle(nodeStartPosition, nodeNextPosition);
     
        return {
            x: nodeShape.nodeWidth,
            y: nodeShape.nodeHeight / 2,
            width,
            angle
        }
    }

    return (
        <div ref={handleRef} style={{
            width: nodeShape.nodeWidth + 'px',
            height: nodeShape.nodeHeight + 'px',
            left: node.position.x + 'px',
            top: node.position.y + 'px',

        }} key={node.id} className='absolute border-2 border-white flex flex-col justify-between text-center'>
            {/* MEMORY-ADRESS */}

            <div style={{
                backgroundColor: isHead ? 'rgb(96 165 250)' : isTail ? 'rgb(248 113 113)' : 'transparent'
            }} className='w-full border-2 h-1/4 flex items-center justify-center'><p className='text-center text-xs'>{getMemoryAdress(index)}</p></div>

            <div className='flex flex-row items-center justify-between w-full h-3/4'>
                {/* NODE-DATA */}
                <div className='w-2/3 bg-green-600 h-full flex items-center justify-center'>
                    <p>{node.data}</p>
                </div>
                {/* NODE-NEXT */}
                <div className='w-1/3 relative'>
                    {node.next ? <div style={{

                    }}><p>{node.next.data}</p>
                    </div> : <div><p>null</p></div>}
                </div>
            </div>
            {node.next && <Arrow arrowShape={getArrowShape()} />}
        </div>

    )
}
