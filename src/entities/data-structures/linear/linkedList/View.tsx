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
import Title from '@/components/ui/Title';
import Arrow from '@/components/ui/arrow';
import { ArrowRight } from 'lucide-react';

export default function View({ isDoubly = false }: {
    isDoubly?: boolean
}) {
    const { linkedList, add, get, traverse, del, isStackOverFlow, clear, error, arrayLs } = UseLinkedList(isDoubly);
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
        <div className='flex items-center justify-center gap-2'>
            <Title title={isDoubly ? 'Doubly Linked List' : 'Linked List'} />
            <Info
                title="DOUBLY LINKED LIST"
                text={
                    <article>
                        <p>A <b>Doubly Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and two pointers (or references): one pointing to the <b>next</b> node and another pointing to the <b>previous</b> node in the sequence. This bidirectional navigation allows more efficient operations, especially for traversal in both directions. Doubly linked lists are particularly useful when frequent insertions and deletions are required at both ends of the list.</p>

                        <h4 className="font-semibold py-2">Key Operations of a Doubly Linked List:</h4>

                        <ul>
                            <li>
                                <b className="font-semibold text-green-400"> Add/Insert: </b>
                                This operation <b>adds a new node to the doubly linked list</b>. The new node can be inserted at the head, tail, or in a specific position. The previous and next pointers need to be updated to maintain the structure. <br />
                                <b>Time complexity:</b> O(1) for insertion at the head or tail, O(n) for insertion at a specific position.
                            </li>
                            <br />
                            <li>
                                <b className="font-semibold text-red-400"> Delete: </b>
                                This operation <b>removes a node from the doubly linked list</b>. The node to be deleted could be anywhere in the list, and both the previous and next pointers of neighboring nodes need to be adjusted. <br />
                                <b>Time complexity:</b> O(1) for deletion at the head or tail, O(n) for deletion at a specific position.
                            </li>
                            <br />
                            <li>
                                <b className="font-semibold text-yellow-400"> Get/Find/Search: </b>
                                This operation <b>finds and returns the first node that contains the desired value</b>. Since a doubly linked list can be traversed from both the head and the tail, searching can be done in either direction. <br />
                                <b>Time complexity:</b> O(n), as each node still needs to be checked sequentially.
                            </li>
                        </ul>
                    </article>
                }
                className="self-start"
            />

        </div>
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


        <div className='flex items-center justify-between w-full'>
            <Properties className='w-full' properties={{
                'heapSize': heap.size,
                'heapFreeSpace': heap.freeSpace,
                'linkedlistSize': linkedList.size,

            }} />
            {linkedList.size > 1 ? <div className='flex items-center '>
                <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} color='green' />
                    <p className='text-md'>:Pointer to the <strong>next</strong> node.</p>
                </div>
                {isDoubly && <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} color='red' />
                    <p className='text-md'>:Pointer to the <strong>prev</strong> node.</p>
                </div>}

            </div> :null}
        </div>

        {/* HEAP SECTION */}

        <HeapContainer loading={isBlocked} heap={heap}>
            {
                arrayLs.map((node, i) => {

                    return (
                        <>

                            <LinkedListNodeComponent isDoubly={isDoubly} setIsAnimationRunning={setIsAnimationRunning} isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />

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
