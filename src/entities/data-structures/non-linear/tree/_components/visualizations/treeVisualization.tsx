

import React from 'react'
import { TreeObj } from '../../types'
import TreeVisualizationLvlsComponent from './treeVisualizationLvlsComponent'
import NodeShape from '@/lib/classes/NodeShape'
type Props = {
    treeObj: TreeObj,
    nodeShape: NodeShape
}
function TreeVisualization({ treeObj, nodeShape }: Props) {




    return (

        <div className='absolute w-screen border-2 border-white '>

            <TreeVisualizationLvlsComponent depth={0} nodeShape={nodeShape} treeObj={treeObj} />

        </div>


    )
}

export default TreeVisualization