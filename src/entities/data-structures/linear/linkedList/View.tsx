'use client'
import React, { useEffect, useState } from 'react'
import UseLinkedList from './hooks/UseLinkedList'
import useHeap from '@/hooks/useHeap';
import Main from '@/components/container/Main';
import LinkedListNodeComponent from './components/linkedListNode';
import OperationsContainer from '@/components/container/OperationsContainer';
import ButtonAction from '../_components/ButtonAction';
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer';
import { Input } from '@/components/ui/input';
import { PopUp } from '@/components/ui/PopUp';

export default function View() {
    const { linkedList, arrayLs, add, traverse, del, isStackOverFlow, clear, error } = UseLinkedList();
    const [table, setTable] = useState({
        col: 5,
        row: 4
    })
    const heap = useHeap({
        nodeShape: linkedList,
        col: table.col,
        row: table.row
    });
    const [isAnimationRunning, setIsAnimationRunning] = useState(false);
    const [addIndex, setAddIndex] = useState(0);
    const [addData, setAddData] = useState('');

    const isBlocked = isStackOverFlow || isAnimationRunning;
    useEffect(() => {


        // test();
    }, [])

    return (
        <Main>
            {/* BUTTONS ACTION SECTION */}

            <OperationsContainer>
                <InputWithButtonContainer>
                    <Input value={addIndex} placeholder="index" className="text-black w-20" onChange={(e) => {
                        if (isBlocked) return;
                        const n = Number.parseInt(e.target.value);
                        setAddIndex(n)

                    }} type="number" min={0} />
                    <Input value={addData} placeholder="data" className="text-black w-20" onChange={(e) => {
                        if (isBlocked) return;

                        setAddData(e.target.value)

                    }} />
                    <ButtonAction title="add" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isBlocked} onClick={async () => {

                        if (isBlocked) return;
                        const position = heap.getNextFreePosition();
                        if (position) await add(addData, addIndex, position.position, position.memoryAddress);




                    }} />

                </InputWithButtonContainer>

            </OperationsContainer>
            {/* HEAP SECTION */}

            <section className='relative' style={{
                width: heap.width + 'px',
                height: heap.height + 'px'
            }}>
                {
                    linkedList.toNodeArray().map((node, i) => {

                        return (
                            <>

                                <LinkedListNodeComponent isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />

                            </>
                        )
                    })
                }
            </section>
            {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                clear();
                setAddData('')
                setAddIndex(0);
                heap.setInitialFreePositions()
            }} open={!!error} showTrigger={false} description={error.description} />}
        </Main>
    )
}
