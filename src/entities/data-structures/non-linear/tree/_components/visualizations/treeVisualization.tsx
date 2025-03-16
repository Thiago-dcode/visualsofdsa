
'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TreeObj, TreeObjFull } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import Tree from '../../_classes/Tree'
import { Primitive } from '@/types'
import TreeNode from '../../_classes/TreeNode'
import { Edge } from '@/lib/classes/Edge'
import TreeLayout from '../../_classes/TreeLayout'
type Props<T extends Primitive, K extends TreeNode<T>> = {
    treeObjFull: TreeObjFull<K>,
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,
    tree: Tree<T, K>
}
const HEIGHT = 200
const BASE_SPACING = 10;

function TreeVisualization<T extends Primitive, K extends TreeNode<T>>({ treeObjFull, tree, onInsertAnimation, onCreateEdgeAnimation }: Props<T, K>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [_treeObj, setTreeObj] = useState<TreeObj<K> | null>(null);
    const [width, _setWidth] = useState<number | null>(null)
    const treeLayout = useRef<TreeLayout<T, K> | null>(null);

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

            _setWidth(containerRef.current!.offsetWidth)

            centerScroll(containerRef.current!.offsetWidth);
        }
        setWidth()
        window.addEventListener('resize', setWidth)

        return () => window.removeEventListener('resize', setWidth)
    }, [containerRef])

    useEffect(() => {
        if (width) {
            const treeLayout = new TreeLayout(tree, HEIGHT, width);
            treeLayout.layout();
            console.log(treeLayout)
            setTreeObj(treeLayout.tree.toTreeObj()?.treeObj || null);
        }
    }, [width])
    return (

        <div
            ref={containerRef}
            className="relative w-full flex items-start justify-start overflow-auto"
            style={{ width: "100vw", height: '100vh' }}
        >
            {width && _treeObj ? (
                <div
                    style={{
                        width: width + "px",
                        height: 200 * (Math.abs(treeObjFull.maxDepth))
                    }}
                    className="absolute"
                >
                    <TreeVisualizationLvlsComponent

                        width={width}
                        tree={tree}
                        treeObj={_treeObj}
                        maxDepth={treeObjFull.maxDepth}
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