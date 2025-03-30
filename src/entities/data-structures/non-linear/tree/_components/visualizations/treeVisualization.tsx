
'use client'
import React, {  useEffect, useRef, useState } from 'react'
import {  TreeObj } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import { Primitive } from '@/types'
import TreeNode from '../../_classes/TreeNode'
import { Edge } from '@/lib/classes/Edge'
import TreeLayout from '../../_classes/TreeLayout'
type Props<T extends Primitive, K extends TreeNode<T>> = {
    
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    treeLayout: TreeLayout<T, K>,
    nodeSize?: number
}
const HEIGHT = 80
const PADDING_X = 10;
function TreeVisualization<T extends Primitive, K extends TreeNode<T>>({ treeLayout, onInsertAnimation, onCreateEdgeAnimation,nodeSize = 35 }: Props<T, K>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [parentWidth, _setparentWidth] = useState<number | null>(null)
    const [treeObj, setTreeObj] = useState<TreeObj<K> | null>(null)
    const [treeWidth, setTreeWidth] = useState<number | null>(null)

    const centerScroll = (width: number) => {
        if (containerRef.current) {
            const parentWidth = containerRef.current.clientWidth;
            const parentHeight = containerRef.current.clientHeight;
            const childWidth = width;
            const childHeight = HEIGHT * (Math.abs(treeLayout.maxDepth))
            const scrollLeft = (childWidth - parentWidth) / 2
            const scrollTop = (childHeight - parentHeight) / 2
            containerRef.current.scrollLeft = scrollLeft;
            containerRef.current.scrollTop = scrollTop;
        }
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const setWidth = () => {
            _setparentWidth(containerRef.current!.offsetWidth)
        }
        setWidth()
        window.addEventListener('resize', setWidth)
        return () => window.removeEventListener('resize', setWidth)
    }, [containerRef])

    useEffect(() => {
        if (!parentWidth) return;
        console.log(nodeSize)
        treeLayout.tree.nodeHeight = nodeSize;
        treeLayout.tree.nodeWidth = nodeSize;
        treeLayout.minSeparation = nodeSize/2;
        treeLayout.lvlHeight = HEIGHT;
        treeLayout.paddingX = PADDING_X;
        treeLayout.layout();
        treeLayout.centerTree(Math.max(parentWidth, treeLayout.treeWidth));
        setTreeWidth(Math.max(parentWidth, treeLayout.treeWidth));
        centerScroll(Math.max(parentWidth, treeLayout.treeWidth));
        setTreeObj(treeLayout.tree.toTreeObj())
    }, [parentWidth, treeLayout,nodeSize])
    return (

        <div
            ref={containerRef}
            className="relative w-full flex items-start justify-start overflow-auto"
            style={{ width: "100vw", height: '100vh' }}
        >
            { treeWidth && treeObj && treeLayout ? (
                <div
                    style={{
                        width: `${treeWidth + PADDING_X * 2}px`,

                            height: HEIGHT * (Math.abs(treeLayout.maxDepth))
                    }}
                    className="absolute"
                >
                    <TreeVisualizationLvlsComponent

                        width={treeWidth}
                        tree={treeLayout.tree}
                        treeObj={treeObj}
                        maxDepth={treeLayout.maxDepth}
                        height={HEIGHT}

                        onInsertAnimation={onInsertAnimation}
                        onCreateEdgeAnimation={onCreateEdgeAnimation}
                    />
                </div>
            ) : null}
        </div>


    )
}

export default TreeVisualization