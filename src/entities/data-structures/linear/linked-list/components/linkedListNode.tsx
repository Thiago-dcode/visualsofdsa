import React, { useCallback, useEffect, useState } from 'react'
import LinkedListNode from '../classes/LinkedListNode'
import { Primitive } from '@/types'
import NodeShape from '@/lib/classes/NodeShape'
import { cn, getAngle, getEuclideanDistance, getMemoryAddress } from '@/lib/utils'
import Arrow from '@/components/ui/arrow'
import { animate } from '@/lib/animations'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { ArrowRight, ArrowLeft, Dot } from 'lucide-react'
type LinkedListNodeProps = {
    node: LinkedListNode<Primitive>,
    nodeShape: NodeShape,
    index: number,
    isHead?: boolean,
    isTail?: boolean,
    isDoubly: boolean
    setAnimationRunning: (e: boolean) => void
}

export default function LinkedListNodeComponent({ isDoubly, node, nodeShape, index, isHead = false, isTail = false, setAnimationRunning }: LinkedListNodeProps) {
    const [isOver, setIsOver] = useState(false);

    const handleRef = useCallback(async (element: HTMLElement | HTMLDivElement | null) => {

        if (!element) return
        node.ref = element;
        if (node.next && node.next.isLastAdd && node.nextEdge) {
            setAnimationRunning(true)
            await animate(node.nextEdge.ref, 'lit-node-edge', 1)
        }
        if (node.isLastAdd) {
            setAnimationRunning(true)

            await animate(element, 'add-node', 1, {
                onlyOnce: true,
            });
            setAnimationRunning(false)
        }

        node.isLastAdd = false;
    }, [])

    useEffect(() => {

        if (node.next && node.next.ref) {
            node.next.ref.style.outline = isOver ? 'rgb(22,163,74,0.8) solid 5px' : 'none'
            node.next.ref.style.borderRadius = isOver ? '5px' : 'none'
        }
        if (node.prev && node.prev.ref && isDoubly) {
            node.prev.ref.style.outline = isOver ? 'rgb(220,38,38,0.8) solid 5px' : 'none'
            node.prev.ref.style.borderRadius = isOver ? '5px' : 'none'
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOver])
    return (
        <HoverCard openDelay={100}>
            <HoverCardTrigger>
                <div onMouseLeave={(e) => {

                    e.stopPropagation();
                    setIsOver(false)
                }} onMouseEnter={(e) => {
                    const element = e.target as HTMLElement;
                    if (element.classList.contains('node-arrow')) return;
                    e.stopPropagation()
                    setIsOver(true);
                }} ref={ref => {
                    (async () => {
                        await handleRef(ref)
                    })()
                }} style={{
                    width: nodeShape.nodeWidth + 'px',
                    height: nodeShape.nodeHeight + 'px',
                    left: node.position.x + 'px',
                    top: node.position.y + 'px',

                }} className='absolute flex flex-col  text-center'>
                    {/* MEMORY-ADRESS */}

                    <header style={{

                    }} className={`${isHead ? "bg-app-bauhaus-green" : isTail ? 'bg-app-bauhaus-yellow' : ''} w-full border-x-2 border-t-2 h-1/5 flex items-center justify-center rounded-t-sm dark:border-white border-black`}><p className='text-center text-xs'>Memory: {node.memoryAddress}</p></header>

                    <main className={`flex flex-row items-center justify-between w-full h-3/5  border-2 dark:border-white border-black`}>
                        {/* NODE-prev */}
                        {isDoubly ? <div className='w-2/5 h-full flex flex-col items-center justify-between relative text-xs  text-center '>

                            <div className='flex items-center justify-center  w-full h-full'>
                                {node.prev ? <p className='w-full h-full break-all flex items-center justify-center overflow-auto' style={{
                                    zIndex: 49,
                                }} >&quot;{node.prev.data}&quot;</p>
                                    : <p className='text-app-bauhaus-blue uppercase font-bold italic' style={{
                                        zIndex: 49,
                                    }}>null</p>}
                            </div>

                        </div> : null}
                        {/* NODE-DATA */}
                        <div className='w-3/5 dark:bg-app-off-white dark:text-black  bg-app-off-black text-white  h-full flex items-center justify-center text-center text-xs overflow-auto'>
                            <p className={cn('h-full w-full text-center flex items-center justify-center  break-all font-semibold text-sm border-r dark:border-r-white border-r-black', {
                                'border-l dark:border-l-white border-l-black': isDoubly
                            })} style={{
                                zIndex: 49,
                            }}>&quot;{node.data}&quot;</p>
                        </div>
                        {/* NODE-NEXT */}
                        <div className='w-2/5 h-full flex flex-col items-center justify-between relative text-xs  text-center '>

                            <div className='flex items-center justify-center  w-full h-full '>
                                {node.next ? <p className='w-full h-full break-all flex items-center justify-center overflow-auto' style={{
                                    zIndex: 49,
                                }} >&quot;{node.next.data}&quot;</p>
                                    : <p className='text-app-bauhaus-blue italic uppercase' style={{
                                        zIndex: 49,
                                    }}>null</p>}
                            </div>

                        </div>
                        {node.next && <Arrow color='green' isActive={isOver} edge={node.nextEdge} extraY={+10} extraX={nodeShape.nodeWidth} />}
                        {node.prev && isDoubly && <Arrow isActive={isOver} edge={node.prevEdge} extraY={-10} extraX={0} />}

                    </main>
                    <footer className={`${isHead ? "bg-app-bauhaus-green" : isTail ? 'bg-app-bauhaus-yellow' : ''} h-1/5 border-b-2 dark:border-white border-black w-full text-center border-x-2    rounded-b-sm text-xs flex flex-row items-center`}>
                        {isDoubly ? <p style={{
                            zIndex: 49,
                        }} className='flex items-center justify-center w-2/5 border-r dark:border-white border-black'>prev</p> : null}
                        <p style={{
                            zIndex: 49,
                        }} className='border-r dark:border-white border-black w-3/5 flex items-center justify-center'>node <span className='text-xs'>({isHead ? 'head' : isTail ? 'tail' : index})</span></p><p style={{
                            zIndex: 49,
                        }} className='flex items-center justify-center w-2/5'>next</p></footer>


                </div>
            </HoverCardTrigger>
            <HoverCardContent className={cn(
                'flex flex-col items-start justify-between border-2',
                {
                    'border-app-bauhaus-green': isHead && !isTail || isHead && isTail,
                    'border-app-bauhaus-yellow': isTail && !isHead,
                   
                }
            )} style={{
                position: 'absolute',
                zIndex: 2000,
                left: (node.position.x - nodeShape.nodeWidth / 2) + 'px',
                top: (node.position.y + nodeShape.nodeHeight) + 'px',
            }}>
                <p className='text-sm font-bold w-full text-center'> {isDoubly ? 'Doubly' : ''} Node Info</p>
                <ul className='flex flex-col items-start justify-between w-full'>


                    <li className='flex flex-row items-center justify-start'> <Dot  size={16} />  <p >Memory: {node.memoryAddress}</p></li>
                    <li className='flex flex-row items-center justify-start'> <Dot  size={16} />  <p >Index: {index}{isHead ? ' (head)' : isTail ? ' (tail)' : ''}</p></li>
                    <li className='flex flex-row items-center justify-start'> <Dot  size={16} />  <p >Position: ({node.position.x}, {node.position.y})</p></li>
                    <li className='flex flex-row items-center justify-start'> <Dot  size={16} />  <p >Data: &quot;{node.data}&quot;</p></li>
                    <li className='flex flex-row items-center justify-start'> <Dot  size={16} />  <p className='w-full flex items-center justify-start'>Next data <ArrowRight className='text-app-bauhaus-green' size={16} />: {isTail ? 'NULL' :`"${node.next?.data}"`}</p></li>
                    {isDoubly && <li className='w-full flex items-center justify-start'>
                        <Dot  size={16} />  <p className='w-full flex items-center justify-start'>Prev data <ArrowLeft className='text-app-bauhaus-red' size={16} />: {isHead ? 'NULL' :`"${node.prev?.data}"`}</p></li>}
                </ul>
            </HoverCardContent>
        </HoverCard>

    )
}
