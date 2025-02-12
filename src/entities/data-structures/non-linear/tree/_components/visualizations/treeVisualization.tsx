
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { TreeObj } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import Tree from '../../_classes/Tree'
import { Primitive } from '@/types'
import Node from '@/entities/data-structures/linear/_classes/Node'
type Props = {
    treeObj: TreeObj,

    tree: Tree<Primitive, Node<Primitive>>
}
const HEIGHT = 150





function TreeVisualization({ treeObj, tree }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [width, _setWidth] = useState<number | null>(null)
    const [x, _setX] = useState<number | null>(null)
    const setWidth = () => {

        if (!containerRef.current) return;
        _setWidth(containerRef.current.offsetWidth)

        setX(containerRef.current.offsetWidth * 0.05)
    }
    const setX = (n: number) => {
        _setX(n)
    }
    useEffect(() => {
        if (!containerRef.current) return;

        setWidth()
        window.addEventListener('resize', setWidth)

        return () => window.removeEventListener('resize', setWidth)
    }, [containerRef])
    return (

        <div ref={containerRef} className='relative w-screen flex items-center justify-center'>

            {width && x ? <div style={{
                width: width + 'px',
            }} className='absolute'>

                <TreeVisualizationLvlsComponent initialX={x} setX={setX} width={width} tree={tree} treeObj={treeObj} height={HEIGHT} x={x} />

            </div> : null}
        </div>


    )
}

export default TreeVisualization