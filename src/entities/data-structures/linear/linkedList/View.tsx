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
import HeapContainer from '@/components/container/HeapContainer';
import Properties from '@/components/app/Properties';
import Section from '@/components/container/Section';

export default function View() {
    const { linkedList, arrayLs, add, traverse, del, isStackOverFlow, clear, error } = UseLinkedList();
    const [table, setTable] = useState({
        col: 5,
        row: 10
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

    return (<Main>
            {/* BUTTONS ACTION SECTION */}

            <OperationsContainer >
                <Section className='gap-2'key={'section-1-linkedList-view'} >
                    <InputWithButtonContainer key={'linkedList-add-action'}>
                        <Input value={addIndex} placeholder="index" className="text-black w-20" onChange={(e) => {
                            if (isBlocked) return;
                            const n = Number.parseInt(e.target.value);
                            setAddIndex(n)

                        }} type="number" min={0} />
                        <Input value={addData} placeholder="data" className="text-black w-20" onChange={(e) => {
                            if (isBlocked) return;

                            setAddData(e.target.value)

                        }} />
                        <ButtonAction title="add" className='bg-green-400 hover:bg-green-600' isLoading={isBlocked} onClick={async () => {

                            if (isBlocked) return;
                            const position = heap.getNextFreePosition();
                            if (position) await add(addData, addIndex, position.position, position.memoryAddress);




                        }} />

                    </InputWithButtonContainer>
                    <ButtonAction  key={'linkedList-addFirst-action'} title="addFirst" className='bg-green-600 hover:bg-green-800' isLoading={isBlocked} onClick={async () => {

                        if (isBlocked) return;
                        const position = heap.getNextFreePosition();
                        if (position) await add(addData, 0, position.position, position.memoryAddress);




                    }} />
                    <ButtonAction key={'linkedList-addLast-action'} title="addLast" className='bg-yellow-600 hover:bg-yellow-800' isLoading={isBlocked} onClick={async () => {

                        if (isBlocked) return;
                        const position = heap.getNextFreePosition();
                        if (position) await add(addData, linkedList.size, position.position, position.memoryAddress);

                    }} /></Section>
            </OperationsContainer>
            <Properties className='w-full' properties={{
                'heapSize': heap.size,
                'heapFreeSpace': heap.freeSpace,
                'linkedlistSize': linkedList.size
            }} />
            {/* HEAP SECTION */}

            <HeapContainer width={heap.width} height={heap.height}>
                {
                    linkedList.toNodeArray().map((node, i) => {

                        return (
                            <>

                                <LinkedListNodeComponent isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />

                            </>
                        )
                    })
                }
            </HeapContainer>
            {(error || heap.error) && <PopUp title={error?.name || heap.error?.name || ''} buttonText="dismiss" handleOnPopUpButton={() => {
                clear();
                setAddData('')
                setAddIndex(0);
                heap.reset()
            }} open={!!error || !!heap.error} showTrigger={false} description={error?.description || heap.error?.description || ''} />}
        </Main>
    )
}
