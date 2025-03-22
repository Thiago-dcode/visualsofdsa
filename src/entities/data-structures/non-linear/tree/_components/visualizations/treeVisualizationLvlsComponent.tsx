'use client'
import { TreeObj } from '../../types'
import TreeNodeComponent from './treeNodeComponent'
import { Primitive } from '@/types'
import Arrow from '@/components/ui/arrow'
import Tree from '../../_classes/Tree'
import { Edge } from '@/lib/classes/Edge'
import { cn } from '@/lib/utils'
import TreeNode from '../../_classes/TreeNode'

function TreeVisualizationLvlsComponent<T extends Primitive, K extends TreeNode<T>>({ treeObj, maxDepth, tree, width, height, onInsertAnimation, onCreateEdgeAnimation }: {
    treeObj: TreeObj<K> | null,
    maxDepth: number,
    tree: Tree<T, K>,
    width: number,
    height: number,
    
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,

}) {
    if (!treeObj) return null;
    const { node, edge, parent, depth, children } = treeObj

    const setY = () => {

        const y = (depth * height) + (height / 2 - tree.nodeHeight / 2);
        node.position.y = y;

    } 
    const setEdge = () => {
        if (!parent || !edge) return;
        edge.setShapeByPosition({
            x: parent.node.position.x + tree.nodeWidth / 2,
            y: parent.node.position.y + tree.nodeHeight / 2
        }, {
            x: node.position.x + tree.nodeWidth / 2,
            y: node.position.y + tree.nodeHeight / 2
        })
    }
    setY();
    setEdge();

    return (
        <>
            {parent?.depth !== depth ? <div style={{
                width: width + 'px',
                height: `${height}px`,
                top: `${depth * height}px`,
                left: '0px'
            }} className={cn('absolute border-t-2 border-t-app-bauhaus-green/80', {
                'border-b-2 border-b-app-bauhaus-green/80': maxDepth === depth
            })}>
            </div> : null}
            <TreeNodeComponent onInsertAnimation={onInsertAnimation} node={node} nodeShape={tree} />
            {edge ? <Arrow onCreateEdgeAnimation={onCreateEdgeAnimation} color='green' edge={edge} /> : null}
            {children && children.length ? children.map(treeObjChild => <TreeVisualizationLvlsComponent<T, K> key={`tree-visualization-lvls-component-${treeObjChild.node.id}`} treeObj={treeObjChild} maxDepth={maxDepth} tree={tree} width={width} height={height} onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} />) : null}
        </>
    )
}

export default TreeVisualizationLvlsComponent