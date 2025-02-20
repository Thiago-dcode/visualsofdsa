
import { TreeObj } from '../../types'
import TreeNodeComponent from './treeNodeComponent'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Primitive } from '@/types'
import Arrow from '@/components/ui/arrow'
import Tree from '../../_classes/Tree'
import BinaryTree from '../../_classes/BinaryTree'
import { Edge } from '@/lib/classes/Edge'

function TreeVisualizationLvlsComponent<T extends Primitive, K extends Node<T>>({ treeObj, tree, parent, width, prevDepth = 1, height, x, initialX, setX, onInsertAnimation, onCreateEdgeAnimation }: {
    treeObj: TreeObj<K>,
    parent?: Node<Primitive>
    tree: Tree<T, K>
    width: number
    prevDepth?: number,
    height: number,
    x: number,
    initialX: number,
    setX: (x: number, currentNodePosition: number) => void,
    onInsertAnimation?: (node: K) => Promise<void>,
    onCreateEdgeAnimation?: (edge: Edge) => Promise<void>,

}) {
    const { node, edge, depth, children } = treeObj
    const setPosition = () => {
        const y = ((Math.abs(depth)) * height) + (height / 2 - tree.nodeHeight / 2);
        let baseX = parent ? parent.position.x : (width / 2 - tree.nodeWidth / 2);
        if (parent && parent.data !== null && node.data !== null) {

            if (tree instanceof BinaryTree) {


                baseX += parent.data > node.data ? -Math.abs(x) : x

            }
        }

        node.position.set(baseX, y)
        if (parent && ((Math.abs(parent.position.x - node.position.x) <= tree.nodeWidth / 2) || (Math.abs(initialX - node.position.x) <= tree.nodeWidth / 2))) {

            setX(initialX + (tree.nodeWidth), node.position.x)
        }

    }
    const setEdge = () => {
        if (!parent || !edge) return;
        edge.setShapeByPosition({
            x: parent.position.x + tree.nodeWidth / 2,
            y: parent.position.y + tree.nodeHeight / 2
        }, {
            x: node.position.x + tree.nodeWidth / 2,
            y: node.position.y + tree.nodeHeight / 2
        })

    }

    setPosition();
    setEdge();

    return (
        <>
            {prevDepth !== depth ? <div style={{
                width: width + 'px',
                height: `${height}px`,
                top: `${Math.abs(depth * height)}px`,
                left: '0px'
            }} className='absolute border-2 border-red-600 '>
            </div> : null}
            <TreeNodeComponent onInsertAnimation={onInsertAnimation} node={node} nodeShape={tree} />
            {edge ? <Arrow onCreateEdgeAnimation={onCreateEdgeAnimation} color='green' edge={edge} /> : null}
            {children && children.length ? children.map(treeObjChild => <TreeVisualizationLvlsComponent<T,K> key={`tree-visualization-lvls-component-${treeObjChild.node.id}`} treeObj={treeObjChild} tree={tree} width={width} prevDepth={depth} parent={node} height={height} x={prevDepth === treeObjChild.depth ? x : x * 0.5} initialX={initialX} setX={setX} onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} />) : null}
        </>
    )
}

export default TreeVisualizationLvlsComponent