'use client'

import React, { useEffect } from 'react'
import UseLinkedList from './hooks/UseLinkedList'
import useHeap from '@/hooks/useHeap';
import Main from '@/components/container/Main';
import Position from '@/lib/classes/Position';

export default function View() {
    const { linkedList, arrayLs, add, traverse, del } = UseLinkedList();
    const heap = useHeap({
        nodeShape: linkedList,
        col: 8,
        row: 5
    });
    const test = async ()=>{


        for (let i = 0; i < 10; i++) {
            const position1= heap.getNextFreePosition();
            if(position1) await add('hello-1', 0, position1)
            
        }
      
  
    }
    useEffect(() => {

      
       test();
    }, [])

    return (
        <Main>
<div className='border-2 border-black relative' style={{
                width: heap.width + 'px',
                height: heap.height + 'px'
            }}>
                {
                    linkedList.toNodeArray().map(node => {

                        // console.log(node.position)
                        return (
                            <div style={{
                                width:linkedList.nodeWidth+ 'px',
                                height:linkedList.nodeHeight+ 'px',
                                left: node.position.x +'px',
                                top: node.position.y +'px',

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
