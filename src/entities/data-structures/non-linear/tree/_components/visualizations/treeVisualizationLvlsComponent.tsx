'use client'
import React, { useEffect, useRef } from 'react'
import { TreeObj } from '../../types'
import NodeShape from '@/lib/classes/NodeShape'
import TreeNodeComponent from './treeNodeComponent'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Primitive } from '@/types'
import Arrow from '@/components/ui/arrow'
import { Edge } from '@/lib/classes/Edge'
import Tree from '../../_classes/Tree'
import BinaryTree from '../../_classes/BinaryTree'
const LVLHIGHT = 25
const ROOTX = 50;
const X = 25;
function TreeVisualizationLvlsComponent({ treeObj, tree, parent, depth, width }: {
    treeObj: TreeObj,
    depth: number,
    parent?: Node<Primitive>
    tree: Tree<Primitive, Node<Primitive>>
    width: number
}) {

    const { node, edge, children } = treeObj

    const setPosition = () => {

        const y = depth * LVLHIGHT;
        let x = width / 2;
        if (parent && parent.data !== null && node.data !== null && depth !== 0) {

            const _x = depth === 1 ? ROOTX : X
            if (tree instanceof BinaryTree) {
                x += parent.data > node.data ? -Math.abs(depth * _x) : Math.abs(depth * _x);

            }
        }

        node.position.set(x, y)

    }
    const setEdge = () => {
        if (!parent) return;
        edge.setShape(parent, node, tree)
    }

    useEffect(() => {

        setPosition()
        setEdge()
    }, [])
    return (
        <>

            <TreeNodeComponent node={node} nodeShape={tree} />
            {parent ? <Arrow edge={edge} /> : null}
            {children ? children.map(treeObjChild => {

                return <>

                    <TreeVisualizationLvlsComponent key={`tree-visualization-lvls-component-${treeObjChild.node.id}`} treeObj={treeObjChild} tree={tree} depth={depth - 1} width={width} />
                </>
            }) : null}
        </>
    )
}

export default TreeVisualizationLvlsComponent