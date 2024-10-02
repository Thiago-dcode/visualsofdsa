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
    const { linkedList, add,get, traverse, del, isStackOverFlow, clear, error, arrayLs } = UseLinkedList();
    const [table, setTable] = useState({
        col: 5,
        row: 1
    })
    const heap = useHeap({
        nodeShape: linkedList,
        col: table.col,
        row: table.row
    });
    const [open, setOpen] = useState(false)
    const [isAnimationRunning, setIsAnimationRunning] = useState(false);
    const [addIndex, setAddIndex] = useState(0);
    const [getIndex, setGetIndex] = useState<number | undefined>(undefined);
    const [deleteIndex, setDeleteIndex] = useState<number | undefined>(undefined);
    const [addData, setAddData] = useState('');

    const isBlocked = isStackOverFlow || isAnimationRunning;
    const handleAdd = async (index: number) => {


        if (isBlocked) return;
        const position = heap.getNextFreePosition();
        if (position) await add(addData, index, position.position, position.memoryAddress);





    }
    const handleDelete = async (index: number) => {


        if (isBlocked) return;

        const node = await del(index);
        console.log('NODE DELETED', node)
        if (node) {

            heap.setNextFreePosition(node)
        }





    }

    return (<Main>
        {/* BUTTONS ACTION SECTION */}

        <OperationsContainer open={open} setOpen={setOpen} >
            {/*ADD SECTION */}
            <Section className='gap-2 items-end' key={'section-1-linkedList-view'} >
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
                        setOpen(false)
                        await handleAdd(addIndex)
                    }} />

                </InputWithButtonContainer>
                <ButtonAction key={'linkedList-addFirst-action'} title="addFirst" className='bg-green-600 hover:bg-green-800' isLoading={isBlocked} onClick={async () => {
                    setOpen(false)
                    await handleAdd(0)
                }} />
                <ButtonAction key={'linkedList-addLast-action'} title="addLast" className='bg-yellow-600 hover:bg-yellow-800' isLoading={isBlocked} onClick={async () => {
                    setOpen(false)
                    await handleAdd(linkedList.size)
                }} /></Section>

            {/* GET SECTION */}
            <Section>

                <InputWithButtonContainer key={'linkedList-delete-action'}>
                    <Input value={getIndex} placeholder="index" className="text-black w-20" onChange={(e) => {
                        if (isBlocked) return;
                        const n = Number.parseInt(e.target.value);
                        setGetIndex(!isNaN(n) ? n : undefined)

                    }} type="number" min={0} />

                    <ButtonAction title="get" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isBlocked} onClick={async () => {
                        if (getIndex === undefined) return;
                        setOpen(false)
                        setIsAnimationRunning(true);
                        await get(getIndex)
                        setIsAnimationRunning(false);
                    }} />

                </InputWithButtonContainer>

            </Section>

            {/* DELETE SECTION */}
            {linkedList.size > 0 && <Section className='gap-2'>
                <InputWithButtonContainer key={'linkedList-delete-action'}>
                    <Input value={deleteIndex} placeholder="index" className="text-black w-20" onChange={(e) => {
                        if (isBlocked) return;
                        const n = Number.parseInt(e.target.value);
                        setDeleteIndex(!isNaN(n) ? n : undefined)

                    }} type="number" min={0} />

                    <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                        if (deleteIndex === undefined) return;
                        setOpen(false)
                        await handleDelete(deleteIndex)
                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="deleteHead" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                    setOpen(false)
                    await handleDelete(0)
                }} />
                <ButtonAction title="deleteTail" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                    setOpen(false)
                    await handleDelete(linkedList.size - 1)
                }} />
            </Section>}

        </OperationsContainer>
        <Properties className='w-full' properties={{
            'heapSize': heap.size,
            'heapFreeSpace': heap.freeSpace,
            'linkedlistSize': linkedList.size
        }} />
        {/* HEAP SECTION */}

        <HeapContainer width={heap.width} height={heap.height}>
            {
                arrayLs.map((node, i) => {

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
