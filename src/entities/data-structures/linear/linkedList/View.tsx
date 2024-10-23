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
import Info from '@/components/ui/info';

export default function View() {
    const { linkedList, add, get, traverse, del, isStackOverFlow, clear, error, arrayLs } = UseLinkedList();
    const heap = useHeap({
        nodeShape: linkedList,
        onFree: clear
    });
    const [size, setSize] = useState(0);
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
    const handleAction = async (action: Promise<void>) => {
        if (isBlocked) return;
        setOpen(false)
        setIsAnimationRunning(true);
        await action
        setIsAnimationRunning(false);

    }
    const handleDelete = async (index: number) => {
        if (isBlocked) return;

        const node = await del(index);
        if (node) {

            heap.setNextFreePosition(node)
        }
    }
    useEffect(() => {
        // heap.malloc(50)
    }, [])
    return (<Main>
        {/* BUTTONS ACTION SECTION */}

        <OperationsContainer open={open} setOpen={setOpen} >
            {/*ADD SECTION */}
            {heap.size > 0 ? <Section className='self-start gap-2 items-end' key={'section-1-linkedList-view'} >
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
                        await handleAction(handleAdd(addIndex))
                    }} />

                </InputWithButtonContainer>
                <ButtonAction key={'linkedList-addFirst-action'} title="addFirst" className='bg-green-400 hover:bg-green-600' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleAdd(0))
                }} />
                <ButtonAction key={'linkedList-addLast-action'} title="addLast" className='bg-green-400 hover:bg-green-600' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleAdd(linkedList.size))

                }} /></Section> : null}

            {/* GET SECTION */}
            {linkedList.size > 0 ? <Section className='gap-2 items-end'>

                <InputWithButtonContainer key={'linkedList-delete-action'}>
                    <Input value={getIndex} placeholder="index" className="text-black w-20 text-xs" onChange={(e) => {
                        if (isBlocked) return;
                        const n = Number.parseInt(e.target.value);
                        setGetIndex(!isNaN(n) ? n : undefined)

                    }} type="number" min={0} />

                    <ButtonAction title="get" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isBlocked} onClick={async () => {
                        if (getIndex === undefined || isBlocked) return;
                        await handleAction(get(getIndex))


                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="getFirst" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isBlocked} onClick={async () => {
                    if (isBlocked) return;
                    await handleAction(get(0))
                }} />
                <ButtonAction title="getLast" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isBlocked} onClick={async () => {
                    if (isBlocked) return;
                    await handleAction(get(linkedList.size - 1))
                }} />

            </Section> : null}

            {/* DELETE SECTION */}
            {linkedList.size > 0 ? <Section className='gap-2'>
                <InputWithButtonContainer key={'linkedList-delete-action'}>
                    <Input value={deleteIndex} placeholder="index" className="text-black w-20" onChange={(e) => {
                        if (isBlocked) return;
                        const n = Number.parseInt(e.target.value);
                        setDeleteIndex(!isNaN(n) ? n : undefined)

                    }} type="number" min={0} />

                    <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                        if (deleteIndex === undefined) return;
                        await handleAction(handleDelete(deleteIndex))

                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="deleteFirst" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleDelete(0))
                }} />
                <ButtonAction title="deleteLast" className='bg-red-400 hover:bg-red-600' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleDelete(linkedList.size - 1))
                }} />

            </Section> : null}
            {linkedList.size > 0 ? <ButtonAction title="clear" className='bg-red-700  hover:bg-red-900' isLoading={isBlocked} onClick={async () => {
                await handleAction((async () => {
                    clear();
                    heap.malloc(heap.size);
                    setAddData('')
                    setAddIndex(0);
                })())
            }} /> : null}
        </OperationsContainer>
        <Info
            title="LINKED LIST"
            text={
                <article>
                    <p>A <b>Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and a pointer (or reference) to the next node in the sequence. Unlike arrays, linked lists do not require contiguous memory locations, which allows for more efficient dynamic memory management. Linked lists are commonly used in scenarios where dynamic memory allocation, insertion, and deletion of elements are <b>frequent.</b></p>

                    <h4 className="font-semibold py-2">Key Operations of a Linked List:</h4>

                    <ul>
                        <li>
                            <b className="font-semibold text-green-400"> Add/Insert: </b>
                            This operation <b>adds a new node to the linked list</b>. The new node can be inserted at the beginning, middle, or end of the list, depending on the specific requirements. <br />
                            <b>Time complexity:</b> O(1) for insertion at the head, O(n) for insertion at a specific position.
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-red-400"> Delete: </b>
                            This operation <b>removes a node from the linked list</b>. The node to be deleted can be located at the head, tail, or any specific position. Removing a node involves adjusting the pointers of adjacent nodes to bypass the deleted node. <br />
                            <b>Time complexity:</b> O(1) for deletion at the head, O(n) for deletion at a specific position.
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-yellow-400"> Get/Find/Search: </b>
                            This operation <b>finds and returns the first node that contains the desired value</b>. It involves traversing the list from the head until the value is found or the end of the list is reached. <br />
                            <b>Time complexity:</b> O(n), as each node needs to be checked sequentially.
                        </li>
                    </ul>
                </article>
            }
            className="self-start"
        />

        <Properties className='w-full' properties={{
            'heapSize': heap.size,
            'heapFreeSpace': heap.freeSpace,
            'linkedlistSize': linkedList.size,

        }} />


        {/* HEAP SECTION */}

        <HeapContainer loading={isBlocked} heap={heap}>
            {
                arrayLs.map((node, i) => {

                    return (
                        <>

                            <LinkedListNodeComponent setIsAnimationRunning={setIsAnimationRunning} isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />

                        </>
                    )
                })
            }
        </HeapContainer>
        {(error || heap.error) && <PopUp title={error?.name || heap.error?.name || ''} buttonText="dismiss" handleOnPopUpButton={() => {
            clear();
            setAddData('')
            setAddIndex(0);
            heap.free()
        }} open={!!error || !!heap.error} showTrigger={false} description={error?.description || heap.error?.description || ''} />}
    </Main>
    )
}
