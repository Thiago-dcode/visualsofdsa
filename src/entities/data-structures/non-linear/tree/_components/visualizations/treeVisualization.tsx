
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { TreeObj } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import Tree from '../../_classes/Tree'
import { Primitive } from '@/types'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Edge } from '@/lib/classes/Edge'
type Props<T extends Primitive, K extends Node<T>> = {
    treeObj: TreeObj<K>,
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    tree: Tree<T, K>
}
const HEIGHT = 200





function TreeVisualization<T extends Primitive, K extends Node<T>>({ treeObj, tree, onInsertAnimation, onCreateEdgeAnimation }: Props<T, K>) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [width, _setWidth] = useState<number | null>(null)
    const [x, _setX] = useState<number | null>(null)
    const setWidth = () => {

        if (!containerRef.current) return;
        _setWidth(containerRef.current.offsetWidth)

        _setX(containerRef.current.offsetWidth * 0.05)
    }
    const setX = (n: number, currentNodePosition: number) => {
        if (width && (currentNodePosition <= 0 || currentNodePosition >= width)) {

            _setWidth(width + n * 2)
        }
        _setX(n)
    }
    // Function to center the horizontal scroll
    const centerScroll = () => {
        if (containerRef.current && width) {
            const container = containerRef.current;
            const childWidth = width; 
            const parentWidth = container.clientWidth; 
            const scrollLeft = (childWidth - parentWidth) / 2
            container.scrollLeft = scrollLeft;
        }
    };

    // Call centerScroll when the component mounts or when width changes
    useEffect(() => {
        centerScroll();
    }, [width]);
    useEffect(() => {
        if (!containerRef.current) return;

        setWidth()
        window.addEventListener('resize', setWidth)

        return () => window.removeEventListener('resize', setWidth)
    }, [containerRef])

    return (

        <div
            ref={containerRef}
            className="relative w-full flex items-start justify-start overflow-x-auto "
            style={{ width: "100vw", height: '100vh', }}
        >
            {width && x ? (
                <div
                    style={{
                        width: width + "px",
                    }}
                    className="absolute flex-shrink-0 snap-center"
                >
                    <TreeVisualizationLvlsComponent
                        initialX={x}
                        setX={setX}
                        width={width}
                        tree={tree}
                        treeObj={treeObj}
                        height={HEIGHT}
                        x={x}
                        onInsertAnimation={onInsertAnimation}
                        onCreateEdgeAnimation={onCreateEdgeAnimation}
                    />
                </div>
            ) : null}
        </div>


    )
}

export default TreeVisualization