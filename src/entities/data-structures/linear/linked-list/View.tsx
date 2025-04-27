'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import UseLinkedList from './hooks/UseLinkedList'
import useHeap from '@/hooks/useHeap';
import LinkedListNodeComponent from './components/linkedListNode';
import OperationsContainer from '@/components/container/OperationsContainer';
import ButtonAction from '../_components/ButtonAction';
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer';
import { Input } from '@/components/ui/input';
import { PopUp } from '@/components/ui/PopUp';
import HeapContainer from '@/components/container/HeapContainer';
import Properties from '@/components/app/Properties';
import Section from '@/components/container/Section';
import { ArrowRight } from 'lucide-react';
import { useAnimationRunning } from '@/context/animationRunningContext';
import ConfigComponent from '@/components/app/ConfigComponent';
import SpeedComponent from '@/components/app/speedComponent';
import { useToast } from '@/hooks/useToast';
import { clearRefs } from '@/lib/utils';

export default function View({ isDoubly = false }: {
    isDoubly?: boolean
}) {
    const { linkedList, add, get, del, isStackOverFlow, clear, error, arrayLs, speed, handleSetSpeed } = UseLinkedList(isDoubly);
    const heap = useHeap({
        nodeShape: linkedList,
        onFree: clear
    });
    const { toastError } = useToast()
    const [open, setOpen] = useState(false)
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
    const inputAddIndexRef = useRef<HTMLInputElement>(null)
    const inputAddDataRef = useRef<HTMLInputElement>(null)
    const inputGetIndexRef = useRef<HTMLInputElement>(null)
    const inputDeleteIndexRef = useRef<HTMLInputElement>(null)
    const makeResponsive = useMemo(() => linkedList.size > 0 && heap.device.twResponsive.laptop, [linkedList.size, heap.device])
    const isBlocked = isStackOverFlow || isAnimationRunning;
    const clearInputs = () => {
        clearRefs(inputAddIndexRef.current, inputAddDataRef.current, inputGetIndexRef.current, inputDeleteIndexRef.current)
    }
    const handleAdd = async (index: number) => {
        if (!inputAddDataRef.current || isBlocked) return;
        const addData = inputAddDataRef.current.value || '';
        if (addData.length > 100) {
            inputAddDataRef.current.value = ''
            toastError('Max length is 100 characters')
            return;
        };
        const position = heap.getNextFreePosition();

        if (position) {
            if (makeResponsive) setOpen(false);
            setAnimationRunning(true);
            await add(addData, index, position.position, position.memoryAddress);
            setAnimationRunning(false);
        }
        if (inputAddDataRef.current) inputAddDataRef.current.value = ''

    }
    const handleAddByInput = async () => {
        if (!inputAddIndexRef.current || isBlocked) return;
        const addIndex = Number.parseInt(inputAddIndexRef.current.value);
        if (isNaN(addIndex)) {
            inputAddIndexRef.current.value = ''
            toastError('Invalid index')
            return;
        };
        await handleAdd(addIndex)
        inputAddIndexRef.current.value = ''


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
        if (makeResponsive) setOpen(false);
        setAnimationRunning(true);
        const node = await del(index);
        if (node) {
            heap.setNextFreePosition(node)
        }
        setAnimationRunning(false);
    }
    const handleDeleteByInput = async () => {
        if (isBlocked || !inputDeleteIndexRef.current) return;
        const deleteIndex = Number.parseInt(inputDeleteIndexRef.current.value);
        if (isNaN(deleteIndex)) {
            inputDeleteIndexRef.current.value = ''
            toastError('Invalid index')
            return;
        }
        await handleDelete(deleteIndex)
        inputDeleteIndexRef.current.value = ''
    }
    const handleGet = async (index: number) => {
        if (isBlocked) return;
        if (makeResponsive) setOpen(false);
        setAnimationRunning(true);
        await get(index);
        setAnimationRunning(false);
    }
    const handleGetByInput = async () => {
        if (isBlocked || !inputGetIndexRef.current) return;
        const getIndex = Number.parseInt(inputGetIndexRef.current.value);
        if (isNaN(getIndex)) {
            inputGetIndexRef.current.value = ''
            toastError('Invalid index')
            return;
        }
        await handleGet(getIndex)
        inputGetIndexRef.current.value = ''
    }
    const setUpLinkedList = useCallback(() => {
        linkedList.nodeWidth = isDoubly ? 180 : 120;
        linkedList.nodeHeightSpacing = 40;
        linkedList.nodeWidthSpacing = 70;
        linkedList.nodeHeight = 80;
        if (heap.device.twResponsive.phone) {
            linkedList.nodeWidth = isDoubly ? 140 : 100;
            linkedList.nodeHeightSpacing = 30;
            linkedList.nodeWidthSpacing = 20;
            linkedList.nodeHeight = 60;
        }

    }, [isDoubly, linkedList, heap.device]);
    useEffect(() => {
        setUpLinkedList();
    }, [setUpLinkedList]);

    return (<>
        {!makeResponsive && <OperationsContainer open={open} setOpen={setOpen} >
            {/*ADD SECTION */}
            {heap.size > 0 ? <Section className='self-start gap-2 items-end' key={'section-1-linkedList-view'} >
                <InputWithButtonContainer key={'linkedList-add-action'}>
                    <Input ref={inputAddIndexRef} placeholder="index" className="text-black w-24" onChange={(e) => {


                    }} type="number" min={0} />
                    <Input ref={inputAddDataRef} placeholder="data" className="text-black w-24" onChange={(e) => {

                    }} />
                    <ButtonAction title="add" action='write' isLoading={isBlocked} onClick={async () => {
                        await handleAddByInput()
                    }} />

                </InputWithButtonContainer>
                <ButtonAction key={'linkedList-addFirst-action'} title="addFirst" action='write' isLoading={isBlocked} onClick={async () => {
                    await handleAdd(0)
                }} />
                <ButtonAction key={'linkedList-addLast-action'} title="addLast" action='write' isLoading={isBlocked} onClick={async () => {
                    await handleAdd(linkedList.size)

                }} /></Section> : null}

            {/* GET SECTION */}
            {linkedList.size > 0 ? <Section className='gap-2 items-end'>

                <InputWithButtonContainer key={'linkedList-delete-action'}>
                    <Input ref={inputGetIndexRef} placeholder="index" className="text-black w-24 text-xs" type="number" min={0} />

                    <ButtonAction title="get" action='read' isLoading={isBlocked} onClick={async () => {
                        await handleGetByInput()

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
                    <Input ref={inputDeleteIndexRef} placeholder="index" className="text-black w-24" type="number" min={0} />

                    <ButtonAction title="delete" action='delete' isLoading={isBlocked} onClick={async () => {
                        await handleDeleteByInput()

                    }} />

                </InputWithButtonContainer>
                <ButtonAction title="deleteFirst" action='delete' isLoading={isBlocked} onClick={async () => {
                    await handleDelete(0)
                }} />
                <ButtonAction title="deleteLast" action='delete' isLoading={isBlocked} onClick={async () => {
                    await handleDelete(linkedList.size - 1)
                }} />

            </Section> : null}
            {linkedList.size > 0 ? <ButtonAction title="clear" action='delete' isLoading={isBlocked} onClick={async () => {
                await handleAction((async () => {
                    clear();
                    heap.malloc(heap.size);
                    clearInputs()
                })())
            }} /> : null}
        </OperationsContainer>}


        <div className='flex items-center justify-between w-full'>
            <div>
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
            </div>

            {linkedList.size > 1 && !makeResponsive ? <div className='flex items-center '>
                <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} className='text-app-bauhaus-green' />
                    <p className='text-md'>:Pointer to the <strong>next</strong> node.</p>
                </div>
                {isDoubly && <div className='flex items-start justify-start gap-1'>
                    <ArrowRight size={30} className='text-app-bauhaus-red' />
                    <p className='text-md'>:Pointer to the <strong>prev</strong> node.</p>
                </div>}

            </div> : null}
            {makeResponsive && <OperationsContainer enabled={!isBlocked} makeResponsive={makeResponsive} open={open} setOpen={setOpen} className='flex flex-col gap-4 items-end justify-start' >
                {/*ADD SECTION */}
                {heap.size > 0 ? <Section className='gap-2' makeResponsive={makeResponsive} key={'section-1-linkedList-view'} >
                    <InputWithButtonContainer makeResponsive={makeResponsive} key={'linkedList-add-action'}>
                        <Input ref={inputAddIndexRef} placeholder="index" className="text-black w-24" type="number" min={0} />
                        <Input ref={inputAddDataRef} placeholder="data" className="text-black w-24" />
                        <ButtonAction title="add" action='write' isLoading={isBlocked} onClick={async () => {
                            await handleAddByInput()
                        }} />

                    </InputWithButtonContainer>
                    <div className='flex  gap-2 items-end justify-start'>   <ButtonAction key={'linkedList-addFirst-action'} title="addFirst" action='write' isLoading={isBlocked} onClick={async () => {
                        await handleAdd(0)
                    }} />
                        <ButtonAction key={'linkedList-addLast-action'} title="addLast" action='write' isLoading={isBlocked} onClick={async () => {
                            await handleAdd(linkedList.size)

                        }} /></div></Section> : null}

                {/* GET SECTION */}
                {linkedList.size > 0 ? <Section className='gap-2' makeResponsive={makeResponsive} >

                    <InputWithButtonContainer makeResponsive={makeResponsive} key={'linkedList-delete-action'}>
                        <Input ref={inputGetIndexRef} placeholder="index" className="text-black w-24 text-xs" type="number" min={0} />

                        <ButtonAction title="get" action='read' isLoading={isBlocked} onClick={async () => {
                            await handleGetByInput()


                        }} />

                    </InputWithButtonContainer>
                    <div className='flex gap-2 items-end justify-start'>
                        <ButtonAction title="getFirst" action='read' isLoading={isBlocked} onClick={async () => {
                            await handleGet(0)
                        }} />
                        <ButtonAction title="getLast" action='read' isLoading={isBlocked} onClick={async () => {
                            await handleGet(linkedList.size - 1)
                        }} />
                    </div>

                </Section> : null}

                {/* DELETE SECTION */}
                {linkedList.size > 0 ? <Section className='gap-2' makeResponsive={makeResponsive} >
                    <InputWithButtonContainer makeResponsive={makeResponsive} key={'linkedList-delete-action'}>
                        <Input ref={inputDeleteIndexRef} placeholder="index" className="text-black w-24" type="number" min={0} />

                        <ButtonAction title="delete" action='delete' isLoading={isBlocked} onClick={async () => {
                            await handleDeleteByInput()

                        }} />

                    </InputWithButtonContainer>
                    <div className='flex gap-2 items-end justify-end'>  <ButtonAction title="deleteFirst" action='delete' isLoading={isBlocked} onClick={async () => {
                        await handleDelete(0)
                    }} />
                        <ButtonAction title="deleteLast" action='delete' isLoading={isBlocked} onClick={async () => {
                            await handleDelete(linkedList.size - 1)
                        }} /></div>

                </Section> : null}
                {linkedList.size > 0 ? <ButtonAction title="clear" action='delete' isLoading={isBlocked} onClick={async () => {
                    await handleAction((async () => {
                        clear();
                        heap.malloc(heap.size);
                        clearInputs()
                    })())
                }} /> : null}
            </OperationsContainer>}
            <ConfigComponent available={!isBlocked} >

                <SpeedComponent speed={speed} setSpeed={handleSetSpeed} />
            </ConfigComponent>
        </div>

        {/* HEAP SECTION */}

        <HeapContainer loading={isBlocked} heap={heap} >
            {
                arrayLs.map((node, i) => <LinkedListNodeComponent isDoubly={isDoubly} setAnimationRunning={setAnimationRunning} isHead={linkedList.head && linkedList.head.id === node.id ? true : false} isTail={linkedList.tail && linkedList.tail.id === node.id ? true : false} key={`linkedListNodeComponent-${node.data}-${node.id}-(${node.position.x},${node.position.y})`} index={i} node={node} nodeShape={linkedList} />)
            }
        </HeapContainer>
        {(error || heap.error) && <PopUp title={error?.name || heap.error?.name || ''} buttonText="dismiss" handleOnPopUpButton={() => {
            clear();

            heap.free()
        }} open={!!error || !!heap.error} showTrigger={false} description={error?.description || heap.error?.description || ''} />}
    </>
    )
}
