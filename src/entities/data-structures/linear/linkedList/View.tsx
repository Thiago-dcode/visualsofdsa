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
    const renderInfo = () => {


        if (isDoubly) {
            return (<article>
                <p>A <b>Doubly Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and two pointers (or references): one pointing to the <b>next</b> node and another pointing to the <b>previous</b> node in the sequence. This bidirectional navigation allows more efficient operations, especially for traversal in both directions. Doubly linked lists are particularly useful when frequent insertions and deletions are required at both ends of the list.</p>

                <h4 className="font-semibold py-2">Key Operations of a Doubly Linked List:</h4>

                <ul>
                    <li>
                        <b className="font-semibold text-green-400"> Add: </b>
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
                        <b className="font-semibold text-yellow-400"> Get: </b>
                        This operation <b>finds and returns the first node that contains the desired value</b>. Since a doubly linked list can be traversed from both the head and the tail, searching can be done in either direction. <br />
                        <b>Time complexity:</b> O(n), as each node still needs to be checked sequentially.
                    </li>
                </ul>
            </article>)
        }

        return (<article> <p>A <b>Linked List</b> is a <b>linear data structure</b> consisting of nodes, where each node contains a value and a pointer (or reference) to the <b>next</b> node in the sequence. Unlike arrays, linked lists do not require contiguous memory locations, making them more flexible for dynamic memory allocation. Linked lists are particularly useful when frequent insertions and deletions are required, especially at the head or tail.</p>

            <h4 className="font-semibold py-2">Key Operations of a Linked List:</h4>

            <ul>
                <li>
                    <b className="font-semibold text-green-400"> Add: </b>
                    This operation <b>adds a new node to the linked list</b>. The new node can be inserted at the head, tail, or a specific position. The pointer of the previous node needs to be updated to maintain the structure. <br />
                    <b>Time complexity:</b> O(1) for insertion at the head, O(n) for insertion at a specific position or at the tail (if traversing is needed).
                </li>
                <br />
                <li>
                    <b className="font-semibold text-red-400"> Delete: </b>
                    This operation <b>removes a node from the linked list</b>. The node to be deleted could be anywhere in the list, and the pointer of the previous node must be adjusted to skip over the deleted node. <br />
                    <b>Time complexity:</b> O(1) for deletion at the head, O(n) for deletion at a specific position or at the tail (if traversing is needed).
                </li>
                <br />
                <li>
                    <b className="font-semibold text-yellow-400"> Get: </b>
                    This operation <b>finds and returns the first node that contains the desired value</b>. The list must be traversed from the head until the value is found or the end is reached. <br />
                    <b>Time complexity:</b> O(n), as each node needs to be checked sequentially.
                </li>
            </ul>

        </article>)
    }
    useEffect(() => {
        // heap.malloc(50)
    }, [])
    return (<Main>
        {/* BUTTONS ACTION SECTION */}
        <div className='flex items-center justify-center gap-2'>
            <Title title={isDoubly ? 'Doubly Linked List' : 'Linked List'} />
            <Info
                title={isDoubly? "DOUBLY LINKED LIST":"LINKED LIST"}
                text={renderInfo()}
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
                    <ButtonAction title="add" action='write' isLoading={isBlocked} onClick={async () => {
                        await handleAction(handleAdd(addIndex))
                    }} />

                </InputWithButtonContainer>
                <ButtonAction key={'linkedList-addFirst-action'} title="addFirst" action='write' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleAdd(0))
                }} />
                <ButtonAction key={'linkedList-addLast-action'} title="addLast" action='write' isLoading={isBlocked} onClick={async () => {
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

                    <ButtonAction title="get" action='read' isLoading={isBlocked} onClick={async () => {
                        if (getIndex === undefined || isBlocked) return;
                        await handleAction((async () => {
                            await get(getIndex)
                        })())


                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="getFirst" action='read' isLoading={isBlocked} onClick={async () => {
                    if (isBlocked) return;
                    await handleAction((async () => {
                        await get(0)
                    })())
                }} />
                <ButtonAction title="getLast" action='read' isLoading={isBlocked} onClick={async () => {
                    if (isBlocked) return;
                    await handleAction((async () => {
                        await get(linkedList.size - 1)
                    })())
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

                    <ButtonAction title="delete" action='delete' isLoading={isBlocked} onClick={async () => {
                        if (deleteIndex === undefined) return;
                        await handleAction(handleDelete(deleteIndex))

                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="deleteFirst" action='delete' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleDelete(0))
                }} />
                <ButtonAction title="deleteLast" action='delete' isLoading={isBlocked} onClick={async () => {
                    await handleAction(handleDelete(linkedList.size - 1))
                }} />

            </Section> : null}
            {linkedList.size > 0 ? <ButtonAction title="clear" action='delete' isLoading={isBlocked} onClick={async () => {
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
                'heapSize': {
                    value: heap.size
                },
                'heapFreeSpace': {
                    value: heap.freeSpace
                },
                'linkedlistSize': {
                    value: linkedList.size
                },

            }} />
            {linkedList.size > 1 ? <div className='flex items-center '>
                <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} className='text-app-bauhaus-green' />
                    <p className='text-md'>:Pointer to the <strong>next</strong> node.</p>
                </div>
                {isDoubly && <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} className='text-app-bauhaus-red' />
                    <p className='text-md'>:Pointer to the <strong>prev</strong> node.</p>
                </div>}

            </div> : null}
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
