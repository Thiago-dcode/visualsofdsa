import React, { useCallback, useEffect, useState } from 'react'
import LinkedListNode from '../classes/LinkedListNode'
import { Primitive } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'
import { getAngle, getEuclideanDistance, getMemoryAddress } from '@/lib/utils'
import Arrow from '@/components/ui/arrow'

type LinkedListNodeProps = {
    node: LinkedListNode<Primitive>,
    nodeShape: NodeShape,
    index: number,
    isHead?: boolean,
    isTail?: boolean,
}

export default function LinkedListNodeComponent({ node, nodeShape, index, isHead = false, isTail = false }: LinkedListNodeProps) {
    const [isOver, setIsOver] = useState(false);
    // const getArrowShape = (nodeStart: LinkedListNode<Primitive>|null, nodeEnd: LinkedListNode<Primitive>|null) => {
    //     if (!nodeStart || !nodeEnd) return {
    //         x: 0,
    //         y: 0,
    //         length: 0,
    //         angle: 0
    //     }
    //     const nodeStartPosition = {
    //         x: nodeStart.position.x + nodeShape.nodeWidth,
    //         y: nodeStart.position.y + nodeShape.nodeHeight / 2
    //     }
    //     const nodeNextPosition = {
    //         x: nodeEnd.position.x,
    //         y: nodeEnd.position.y + nodeShape.nodeHeight / 2
    //     }

    //     const length = getEuclideanDistance(nodeStartPosition, nodeNextPosition);

    //     const angle = getAngle(nodeStartPosition, nodeNextPosition);

    //     return {
    //         x: nodeShape.nodeWidth,
    //         y: nodeShape.nodeHeight / 2,
    //         length,
    //         angle
    //     }
    // }
    const handleRef = useCallback((element: HTMLElement | HTMLDivElement | null) => {
      
        if (!element) return
        node.ref = element;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div onMouseLeave={(e) => {

            e.stopPropagation();
            setIsOver(false)
        }} onMouseEnter={(e) => {
            const element = e.target as HTMLElement;
            if (element.classList.contains('node-arrow')) return;
            e.stopPropagation()
            setIsOver(true);
        }} ref={handleRef} style={{
            width: nodeShape.nodeWidth + 'px',
            height: nodeShape.nodeHeight + 'px',
            left: node.position.x + 'px',
            top: node.position.y + 'px',

        }}  className='absolute flex flex-col  text-center'>
            {/* MEMORY-ADRESS */}

            <header style={{

            }} className={`${isHead ? "bg-green-600" : isTail ? 'bg-yellow-600' : ''} w-full border-x-2 border-t-2 h-1/5 flex items-center justify-center rounded-t-sm`}><p className='text-center text-xs'>Memory: {node.memoryAddress}</p></header>

            <main className={`flex flex-row items-center justify-between w-full h-3/5  border-2 border-white`}>

                {/* NODE-DATA */}
                <div className='w-3/5 bg-app-ivory text-black h-full flex items-center justify-center text-center text-xs overflow-auto'>
                    <p className='h-full w-full text-center flex items-center justify-center break-all font-semibold text-sm' style={{
                        zIndex: 49,
                    }}>{node.data}</p>
                </div>
                {/* NODE-NEXT */}
                <div className='w-2/5 h-full flex flex-col items-center justify-between relative text-xs  text-center '>

                    <div className='flex items-center justify-center  w-full h-full'>
                        {node.next ? <p className='w-full h-full break-all flex items-center justify-center overflow-auto' style={{
                            zIndex: 49,
                        }} >{node.next.data}</p>
                            : <p className='text-blue-500 italic' style={{
                                zIndex: 49,
                            }}>null</p>}
                    </div>

                </div>
                {node.next && <Arrow isActive={isOver}  edge={node.nextEdge} />}
                
            </main>
            <footer className={`${isHead ? "bg-green-600" : isTail ? 'bg-yellow-600' : ''} h-1/5 border-b-2 border-white w-full text-center border-x-2    rounded-b-sm text-xs flex flex-row items-center`}><p style={{
                zIndex: 49,
            }} className='border-r border-white w-3/5 flex items-center justify-center'>node <span className='text-xs'>({isHead? 'head':isTail?'tail':index})</span></p><p style={{
                zIndex: 49,
            }} className='flex items-center justify-center w-2/5'>next</p></footer>


        </div>

    )
}
