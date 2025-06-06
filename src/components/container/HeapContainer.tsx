import React, { ReactNode, useRef } from 'react'
import { Heap } from '@/hooks/useHeap'
import Info from '../ui/info';
import { Dot } from 'lucide-react';
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction';
import { Input } from '../ui/input';
import InputWithButtonContainer from './InputWithButtonContainer';
import Section from './Section';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

function HeapContainer({ heap, children, loading }: {
    heap: Heap,
    children: ReactNode,
    loading: boolean,

}) {
    const { toastInfo } = useToast()
    const inputRef = useRef<HTMLInputElement>(null);

    const { width, height, size: heapSize, malloc, relloc, free } = heap;

    const getInputValue = () => {
        if (!inputRef.current) return 0;
        const n = Number.parseInt(inputRef.current.value);
        if (isNaN(n) || n < 0 || n > 100) {
            toastInfo('Please enter a valid number between 0 and 100')
            return null;
        };
        return n;
    }
    const clearInput = () => {
        if (!inputRef.current) return;
        inputRef.current.value = '';
    }
    const handleMalloc = () => {
        const value = getInputValue();
        if (value === null) return;
        malloc(value)
        clearInput()
    }
    const handleRelloc = () => {
        const value = getInputValue();
        if (value === null) return;
        relloc(value)
        clearInput()
    }
    return (
        <section >

            <Section style={{
                width: !heapSize ? '100%' : width + 'px',
            }} className={cn('self-start flex-row flex items-start justify-between gap-5   mb-2', {
                'opacity-25': loading
            })}>
                <div className=' flex items-center gap-2'>
                    <h4 className='text-xl'>Heap</h4>
                    <Info size={30} title='Heap' text={
                        <div className='flex flex-col items-start justify-start gap-3'>
                            <section className='flex flex-col items-start justify-start gap-2'>
                                <p>
                                    The <strong>heap</strong> is a portion of RAM allocated to runtime functions that need temporary storage while running.
                                    Memory allocated from the heap will remain allocated until one of the following occurs:
                                </p>

                                <ul>
                                    <li><strong>The memory is freed.</strong></li>
                                    <li><strong>The program terminates.</strong></li>
                                </ul>

                                <p>
                                    If all references to allocated memory are lost (e.g., you no longer store a pointer to it), you experience what is called a <strong>memory leak</strong>.
                                    In this situation, the memory remains allocated, but you have no easy way of accessing it.
                                    Leaked memory cannot be reclaimed for future allocations, but when the program ends, the operating system will free it.
                                </p>

                                <p>
                                    In contrast, <strong>stack memory</strong> is where local variables reside.
                                    Memory in the stack is allocated and deallocated automatically using a <strong>LIFO (Last-In-First-Out)</strong> approach.
                                </p>

                                <p>
                                    Generally, most modern programming languages like Java and Python handle heap management automatically,
                                    so programmers don’t need to manage it manually.
                                    However, in some low-level languages like C and Assembly, you must manually allocate and deallocate memory.
                                </p>
                            </section>

                            <section>
                                <h2 className='font-semibold'>Some Key Functions to Manage Heap Memory Using C Programming:</h2>
                                <ul className='flex flex-col items-start justify-start gap-2'>
                                    <li className='flex items-start justify-start gap-2'>
                                        <Dot />
                                        <div><p><strong className='text-green-400'>malloc()</strong> allocates memory of a requested size and returns a pointer to the beginning of the allocated block.</p>
                                            <p>Example for creating an array of length 10: <strong><i>int* arrayPtr = (int *)malloc(10 * sizeof(int));</i></strong></p></div>
                                    </li>
                                    <li className='flex items-start justify-start gap-2'>
                                        <Dot />
                                        <div>   <p><strong className='text-yellow-400'>realloc()</strong> resizes a previously allocated memory block. It can increase or decrease the size of the block while preserving the data within the valid portion.</p>
                                            <p>Example for resizing an array to length 20: <strong><i>arrayPtr = (int *)realloc(arrayPtr, 20 * sizeof(int));</i></strong></p></div>
                                    </li>
                                    <li className='flex items-start justify-start gap-2'>
                                        <Dot />
                                        <div> <p><strong className='text-red-400'>free()</strong> deallocates the memory previously allocated  making it available for future use.</p>
                                            <p>Example of freeing allocated memory: <strong> <i>free(arrayPtr);</i></strong></p></div>
                                    </li>
                                </ul>
                            </section>
                        </div>
                    } />

                </div>
                <div className='self-end flex items-center gap-2 relative'>
                    {heapSize <= 0 ? <InputWithButtonContainer key={'linkedList-add-action'}>
                        <Input className='phone:w-24 w-20' ref={inputRef} placeholder="index" type="number" min={0} max={100} />

                        <ButtonAction title="malloc" action='write' isLoading={loading} onClick={handleMalloc} />

                    </InputWithButtonContainer> : <Section className='relative  self-end'><InputWithButtonContainer key={'linkedList-add-action'}>
                        <Input className='phone:w-24 w-20' ref={inputRef} placeholder="index" type="number" min={0} max={100} />

                        <ButtonAction title="Relloc" action='fill' isLoading={loading} onClick={handleRelloc} />

                    </InputWithButtonContainer>
                        <ButtonAction title="Free" action='delete' isLoading={loading} onClick={() => {
                            if (loading) return;
                            free()
                        }} />

                    </Section>}
                </div>
            </Section>

            {heapSize > 0 ? <div className='p-1 phone:p-4 dark:border-app-off-white border-app-off-black border-2 rounded-sm'>
                <div className='relative' style={{
                    width: width + 'px',
                    height: height + 'px'
                }}>
                    {children}
                </div>
            </div> : null}

        </section>
    )
}



export default HeapContainer