
'use client'
import React, {  useEffect, useRef, useState } from 'react'
import {  TreeObjFull } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import { Primitive } from '@/types'
import TreeNode from '../../_classes/TreeNode'
import { Edge } from '@/lib/classes/Edge'
import TreeLayout from '../../_classes/TreeLayout'
type Props<T extends Primitive, K extends TreeNode<T>> = {
    
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    treeLayout: TreeLayout<T, K>
}
const HEIGHT = 80
const PADDING_X = 10;
function TreeVisualization<T extends Primitive, K extends TreeNode<T>>({ treeLayout, onInsertAnimation, onCreateEdgeAnimation }: Props<T, K>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [parentWidth, _setparentWidth] = useState<number | null>(null)
    const [treeWidth, setTreeWidth] = useState<number | null>(null)

    const centerScroll = (width: number) => {
        if (containerRef.current) {
            const parentWidth = containerRef.current.clientWidth;
            const childWidth = width;
            const scrollLeft = (childWidth - parentWidth) / 2
            containerRef.current.scrollLeft = scrollLeft;
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
        treeLayout.tree.nodeHeight = 30;
        treeLayout.tree.nodeWidth = 30;
        treeLayout.lvlHeight = HEIGHT;
        treeLayout.paddingX = PADDING_X;
        treeLayout.minSeparation = 10;
        treeLayout.layout();
        treeLayout.centerTree(Math.max(parentWidth, treeLayout.treeWidth));
        setTreeWidth(Math.max(parentWidth, treeLayout.treeWidth));
        centerScroll(Math.max(parentWidth, treeLayout.treeWidth));
    }, [parentWidth, treeLayout])
    return (

        <div
            ref={containerRef}
            className="relative w-full flex items-start justify-start overflow-x"
            style={{ width: "100vw", height: '100vh' }}
        >
            { treeWidth && treeLayout ? (
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
                        treeObj={treeLayout.tree.toTreeObj()}
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