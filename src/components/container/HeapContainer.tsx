import React, { ReactNode } from 'react'
import { Heap } from '@/hooks/useHeap'
import Info from '../ui/info';
import { Dot } from 'lucide-react';

function HeapContainer({ heap, children }: {
    heap: Heap,
    children: ReactNode
}) {
    const { width, height, size } = heap;
    return (
        <section className=''>
            {size > 0 ? <>
                <div className='flex items-center justify-self-start gap-2'>
                    <h4 className='text-4xl'>Heap</h4>
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
                <div className='p-4 border-white border-2 rounded-sm'>
                    <div className='relative' style={{
                        width: width + 'px',
                        height: height + 'px'
                    }}>
                        {children}
                    </div>
                </div>
            </> : null}
        </section>
    )
}



export default HeapContainer