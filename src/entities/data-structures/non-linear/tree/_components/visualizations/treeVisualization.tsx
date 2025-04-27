
'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeObj } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import { Primitive } from '@/types'
import TreeNode from '../../_classes/TreeNode'
import { Edge } from '@/lib/classes/Edge'
import TreeLayout from '../../_classes/TreeLayout'
import useResponsive from '@/hooks/useResponsive'
type Props<T extends Primitive, K extends TreeNode<T>> = {

    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    treeLayout: TreeLayout<T, K>,
    nodeSize?: number
}
const HEIGHT = 80
const PADDING_X = 30;
function TreeVisualization<T extends Primitive, K extends TreeNode<T>>({ treeLayout, onInsertAnimation, onCreateEdgeAnimation, nodeSize = 35 }: Props<T, K>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [parentWidth, _setparentWidth] = useState<number | null>(null)
    const [treeObj, setTreeObj] = useState<TreeObj<K> | null>(null)
    const [treeWidth, setTreeWidth] = useState<number | null>(null)
    const device = useResponsive((e, device, sizeChanged) => {
        if (sizeChanged.width && containerRef.current) {
            _setparentWidth(containerRef.current.offsetWidth)
        }
    })
    const centerScroll = useCallback((width: number) => {
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
    }, [treeLayout])
    const _nodeSize = useMemo(() => {
        return device.isPhone ? 25 :  device.isTablet ? 35 : nodeSize
    }, [nodeSize,device])
    useEffect(() => {
        if (!parentWidth) return;

        treeLayout.tree.nodeHeight = _nodeSize;
        treeLayout.tree.nodeWidth = _nodeSize;
        treeLayout.minSeparation = _nodeSize / 2;
        treeLayout.lvlHeight = HEIGHT;
        treeLayout.paddingX = PADDING_X;
        treeLayout.layout();
        treeLayout.centerTree(Math.max(parentWidth, treeLayout.treeWidth));
        setTreeWidth(Math.max(parentWidth, treeLayout.treeWidth));
        centerScroll(Math.max(parentWidth, treeLayout.treeWidth));
        setTreeObj(treeLayout.tree.toTreeObj())
    }, [parentWidth, treeLayout, _nodeSize])
    return (

        <div
            ref={(e) => {

                if (e) {
                    containerRef.current = e
                    _setparentWidth(e.offsetWidth)
                }
            }}
            className="relative w-full flex items-start justify-start overflow-auto"
            style={{ width: "100vw", height: '100vh' }}
        >
            {treeWidth && treeObj && treeLayout ? (
                <div
                    style={{
                        width: `${treeWidth + PADDING_X * 2}px`,

                        height: HEIGHT * (Math.abs(treeLayout.maxDepth))
                    }}
                    className="absolute"
                >
                    <TreeVisualizationLvlsComponent

                        width={treeWidth + PADDING_X * 2}
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