'use client'

import React, { useEffect, useState } from 'react'
import UseLinkedList from './hooks/UseLinkedList'
import useHeap from '@/hooks/useHeap';
import Main from '@/components/container/Main';
import Position from '@/lib/classes/Position';
import LinkedListNodeComponent from './components/linkedListNode';

export default function View() {
    const { linkedList, arrayLs, add, traverse, del } = UseLinkedList();
    const [table, setTable] = useState({
        col:4,
        row: 3
    })
    const heap = useHeap({
        nodeShape: linkedList,
        col: table.col,
        row: table.row
    });
    const test = async () => {

        const size = table.col * table.row
        for (let i = 0; i < size; i++) {
            const position = heap.getNextFreePosition();
            if (position) await add(`data-${i}`, linkedList.size, position)

        }
     
        const node = linkedList.findNode(1);
      

        if(node){
              linkedList.delete(1);
            console.log('SETTING NEXT FREE')
            heap.setNextFreePosition(node)
        }
        const position = heap.getNextFreePosition();
       if(position) await add('new-data!',linkedList.size,position)
        linkedList.delete(4);

    }
    useEffect(() => {


        test();
    }, [])

    return (
        <Main>
            <div className=' relative' style={{
                width: heap.width + 'px',
                height: heap.height + 'px'
            }}>
                {
                    linkedList.toNodeArray().map((node, i) => {

                        
                        return (
                            <>
                          
                                <LinkedListNodeComponent isHead={i === 0} isTail={i === linkedList.size - 1} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />
                           
                            </>
                        )
                    })
                }
            </div>
        </Main>
    )
}
