'use client'

import React, { useEffect, useState } from 'react'
import UseLinkedList from './hooks/UseLinkedList'
import useHeap from '@/hooks/useHeap';
import Main from '@/components/container/Main';
import Position from '@/lib/classes/Position';

export default function View() {
    const { linkedList, arrayLs, add, traverse, del } = UseLinkedList();
    const [table, setTable] = useState({
        col: 2,
        row: 8
    })
    const heap = useHeap({
        nodeShape: linkedList,
        col: table.col,
        row: table.row
    }); 
    const test = async () => {


        for (let i = 0; i < table.col *table.row; i++) {
            const position = heap.getNextFreePosition();
            if (position) await add('hello-1', 0, position)

        }


    }
    useEffect(() => {


        test();
    }, [])

    return (
        <Main>
            <div className='border-4 border-red-800 relative' style={{
                width: heap.width + 'px',
                height: heap.height + 'px'
            }}>
                {
                    linkedList.toNodeArray().map(node => {

                        // console.log(node.position)
                        return (
                            <div style={{
                                width: linkedList.nodeWidth + 'px',
                                height: linkedList.nodeHeight + 'px',
                                right: node.position.x + 'px',
                                top: node.position.y + 'px',

                            }} key={node.id} className='absolute border-2 border-white'>
                                {node.data}
                            </div>
                        )
                    })
                }
            </div>
        </Main>
    )
}
