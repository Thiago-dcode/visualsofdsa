'use client'
import Properties from '@/components/app/Properties'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import Main from '@/components/container/Main'
import OperationsContainer from '@/components/container/OperationsContainer'
import Section from '@/components/container/Section'
import Info from '@/components/ui/info'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import Title from '@/components/ui/Title'
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction'
import useStaticArray from '@/entities/data-structures/linear/staticArray/hooks/useStaticArray'
import { Direction, speed, VisualizationArrays } from '@/types'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import useResponsive from '@/hooks/useResponsive'
import BarVisualization from '../../_components/visualization/barVisualization'
import { SortAlgorithms } from '../_classes/SortAlgorithms'
import { ClosureCompare, ClosureSlice } from '../types'
import Bar from '../../_components/visualization/barVisualization/bar'
import { delay } from '@/lib/utils'
import { animate } from '@/lib/animations'
import { useAnimation } from '../../_hooks/useAnimations'
import { useAnimationSort } from '../comparisionBased/_hooks/useAnimationSort'

export default function MergeSortView() {
  const { animationOnSlice, animateSound,animationOnMerge } = useAnimationSort('bars')
  const maxBarSize = useRef(500);
  const { array, maxSize, createUnsorted, flush, error } = useStaticArray(500);
  const [arrayClone, setArrayClone] = useState<Node<number>[] | null>(null)
  console.log(arrayClone)
  const [speed, setSpeed] = useState<speed>(1);
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const [direction, setDirection] = useState<Direction>('ascending')
  const [open, setOpen] = useState(false);
  const [isSorted, setIsSorted] = useState(false)
  const tempValue = useRef<number>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  useResponsive(() => {
    reset();
  })
  const handleMerge = async () => {
    setOpen(false);
    setAnimationRunning(true);
    if (isSorted) {
      toast.info('Array is already sorted');
      return;
    }

    const onSlice: ClosureSlice = async (array, side) => {

       await animationOnSlice(array,maxBarSize.current)
    }
    const onMerge:ClosureCompare = async (nodeA,nodeB)=>{

      await animationOnMerge(nodeA,nodeB,1)

    }
    await SortAlgorithms.merge(array as Node<number>[], direction, onSlice,onMerge)
    setIsSorted(true)
    setAnimationRunning(false);


  }
  const getValue = () => {
    if (!inputRef.current) return null;
    const value = parseInt(inputRef.current.value);

    if (!value || isNaN(value)) {
      toast.warning('You must select a value', {
        position: 'top-center'
      })
      return null;
    }
    tempValue.current = value;
    return value;
  }
  const resetValue = () => {
    if (!inputRef.current) return null;
    inputRef.current.value = ''
  }
  const handleCreate = async () => {

    setAnimationRunning(true);
    const arraySize = getValue();
    if (arraySize !== null) {
      const _array = await createUnsorted(arraySize) as Node<number>[]
      setArrayClone(_array.map(node=>node.clone()))
    }
     

    setAnimationRunning(false)
    resetValue();

  }
  const toggleDirection = () => {
    setDirection(prev => prev === 'ascending' ? 'descending' : 'ascending');
  }
  const reset = () => {
    flush();
    setIsSorted(false);
    resetValue();
    setAnimationRunning(false)
  }

  return (

    <Main>
      <div className='flex items-center justify-center gap-2'>
        <Title title={'Selection sort'} />
        <Info title="Selection sort" text={<article>
          <header>
            <p>
              Selection Sort is a <b>simple comparison-based sorting algorithm</b> that works by dividing the list into a sorted and an unsorted region. It repeatedly selects the smallest (or largest, depending on the order) element <span className='text-app-bauhaus-red'>(red color)</span> from the unsorted region and swaps it with the first element in the unsorted region, expanding the sorted region with each iteration.
            </p>
          </header>
          <br />
          <main>
            <p>
              **Selection Sort is straightforward to implement, but its performance is limited by its high number of comparisons. However, its deterministic nature makes it suitable for small datasets or scenarios where memory usage is constrained.
            </p>
            <br />
            <div>
              <p>
                For example, in each pass through the array, Selection Sort identifies the smallest element in the unsorted region and swaps it with the element at the start of the unsorted region. This process continues until the entire array is sorted.
              </p>
              <p>
                Unlike some other sorting algorithms, Selection Sort performs the same number of comparisons regardless of the initial order of the array. This makes it predictable but not adaptive to already sorted or nearly sorted data.
              </p>
            </div>
          </main>
          <br />
          <footer>
            <p>
              In conclusion, Selection Sort has a time complexity of <b className='font-bold'>O(n²)</b> in both the average and worst cases. While it is not as efficient as other algorithms for large datasets, its simplicity and lack of additional memory requirements make it useful for learning and for specific use cases where memory is a priority.
            </p>
          </footer>
        </article>


        } className="self-start" />

      </div>
      <OperationsContainer open={open} setOpen={setOpen}>

        {!array ? <Section>


          <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="size" className="text-black w-32 text-center" type="number" min={0} />

            <ButtonAction title="create array" action='write' isLoading={isAnimationRunning} onClick={handleCreate} />

          </InputWithButtonContainer>



        </Section> : <Section className='gap-2 w-full'>
          {!isSorted && <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'ascending' ? false : true} onCheckedChange={() => {
            toggleDirection()
          }} /></div>}
          <ButtonAction title="Sort" action='read' isLoading={isAnimationRunning} onClick={async () => {
            await handleMerge()
          }} />



        </Section>
        }
        <Section className='justify-end'>
          {array && array.length && isSorted ? <ButtonAction title="reset" action='fill' className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={async () => {
            if (tempValue.current) {

              setAnimationRunning(true);
              await createUnsorted(tempValue.current)
              setIsSorted(false)
              setAnimationRunning(false);
            }
            ;

          }} /> : null}
          {array && array.length ? <ButtonAction title="delete" action='delete' className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={() => {
            reset()

          }} /> : null}
        </Section>
      </OperationsContainer>

      <div className='w-full items-end justify-between flex'>

        <Properties properties={{
          DirectionToSort: {
            value: direction,
          },
          maxSize: {
            value: maxSize
          },
          arraySize: {
            value: array?.length || null,
            show: !!array
          }

        }} />
        {array && !isAnimationRunning ? <PopOverComponent content={
          <div className='flex flex-col items-start justify-start'>
            <p>Animation Speed</p>
            <Input defaultValue={speed} onChange={(e) => {
              const speed = parseInt(e.target.value)
              if (speed == 1 || speed == 2 || speed == 3) {
                setSpeed(speed)
                // render()
              }
            }} type='range' min={1} max={3} />

          </div>
        } trigger={<Button size={'icon'} variant={'ghost'} ><Wrench /></Button>} /> : <div></div>}

      </div>
      {array ? <BarVisualization arrayCloned={arrayClone || undefined} maxBarSize={maxBarSize.current} arrayIsSorted={false} direction={direction} array={array as Node<number>[]} setAnimationRunning={setAnimationRunning} /> : null}
      {/* {message && <PopUp title={message.title} buttonText="x" handleOnPopUpButton={() => {
        clearMessage()
      }} open={!!message} showTrigger={false} description={message.description} />} */}
    </Main>
  )
}
