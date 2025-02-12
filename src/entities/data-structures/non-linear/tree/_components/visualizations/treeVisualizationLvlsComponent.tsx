
import { TreeObj } from '../../types'
import TreeNodeComponent from './treeNodeComponent'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Primitive } from '@/types'
import Arrow from '@/components/ui/arrow'
import Tree from '../../_classes/Tree'
import BinaryTree from '../../_classes/BinaryTree'

function TreeVisualizationLvlsComponent({ treeObj, tree, parent, width, prevDepth = 1, height, x, initialX, setX }: {
    treeObj: TreeObj,
    parent?: Node<Primitive>
    tree: Tree<Primitive, Node<Primitive>>
    width: number
    prevDepth?: number,
    height: number,
    x: number,
    initialX: number,
    setX: (x: number) => void

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

            setX(initialX + (tree.nodeWidth * 2))
        }

    }
    const setEdge = () => {
        if (!parent || !edge) return;
        edge.setShape(parent, node, tree)
        edge.x = parent.position.x + tree.nodeWidth / 2
        edge.y = parent.position.y + tree.nodeHeight / 2
    }

    setPosition();
    setEdge();

    // console.log(prevDepth, depth)

    return (
        <>
            {prevDepth !== depth ? <div style={{
                width: width + 'px',
                height: `${height}px`,
                top: `${Math.abs(depth * height)}px`,
                left: '0px'
            }} className='absolute border-2 border-red-600 '>
            </div> : null}
            <TreeNodeComponent node={node} nodeShape={tree} />
            {edge ? <Arrow color='green' edge={edge} /> : null}
            {children && children.length ? children.map(treeObjChild => <TreeVisualizationLvlsComponent key={`tree-visualization-lvls-component-${treeObjChild.node.id}`} treeObj={treeObjChild} tree={tree} width={width} prevDepth={depth} parent={node} height={height} x={prevDepth === treeObjChild.depth ? x : x * 0.5} initialX={initialX} setX={setX} />) : null}
        </>
    )
}

export default TreeVisualizationLvlsComponent