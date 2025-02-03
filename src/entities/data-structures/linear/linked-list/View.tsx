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
import { useAnimationRunning } from '@/context/animationRunningContext';

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
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
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
        setAnimationRunning(true);
        await action
        setAnimationRunning(false);

    }
    const handleDelete = async (index: number) => {
        if (isBlocked) return;

        const node = await del(index);
        if (node) {

            heap.setNextFreePosition(node)
        }
    }

    return (<>
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

                            <LinkedListNodeComponent isDoubly={isDoubly} setAnimationRunning={setAnimationRunning} isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />

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
    </>
    )
}
