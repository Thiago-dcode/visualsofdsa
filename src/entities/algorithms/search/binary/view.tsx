'use client'
import Properties from '@/components/app/Properties'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import Main from '@/components/container/Main'
import OperationsContainer from '@/components/container/OperationsContainer'
import RamContainer from '@/components/container/RamContainer'
import Section from '@/components/container/Section'
import Code from '@/components/ui/Code'
import Info from '@/components/ui/info'
import { Input } from '@/components/ui/input'
import { PopUp } from '@/components/ui/PopUp'
import { Switch } from '@/components/ui/switch'
import Title from '@/components/ui/Title'
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction'
import MemoryAdressContainer from '@/entities/data-structures/linear/_components/MemoryAdressContainer'
import StaticArrayNodeComponent from '@/entities/data-structures/linear/staticArray/components/StaticArrayNodeComponent'
import useStaticArray from '@/entities/data-structures/linear/staticArray/hooks/useStaticArray'
import { Direction, MemorySize, Primitive, speed } from '@/types'
import React, {useRef, useState } from 'react'
import { toast } from 'sonner'
import useSearchAlgorithm from '../_hooks/useSearchAlgorithm'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import ArrayComponent from '../_components/arrayComponent'
import Link from 'next/link'

export default function BinaryView() {
  const { array, maxSize, createSorted, flush, error } = useStaticArray(500);
  const [speed, setSpeed] = useState<speed>(1)
  const {binary } = useSearchAlgorithm(array as Node<number>[] | null, speed);
  const [direction, setDirection] = useState<Direction>('forward')
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleDirection = () => {
    setDirection(prev => prev === 'forward' ? 'reverse' : 'forward')
  }
  const handleSearch = async () => {
    const searchValue = getValue();
    if (searchValue === null) return;
    setAnimationRunning(true);
    await binary(searchValue, direction);
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
    return value;
  }
  const resetValue = () => {
    if (!inputRef.current) return null;
    inputRef.current.value = ''
  }
  const handleCreate = async () => {

    setAnimationRunning(true);
    const arraySize = getValue();
    if (arraySize === null) return;

    await createSorted(arraySize, direction)
    setAnimationRunning(false)
    resetValue();

  }
  const reset = () => {
    flush()
    resetValue();
    setAnimationRunning(false)
  }
  return (

    <Main>
      <div className='flex items-center justify-center gap-2'>
        <Title title={'Binary search'} />
        <Info title="Binary search" text={<article>
          <header>
            <h2><strong>Binary Search</strong></h2>
            <p>Binary search is an efficient method for finding an element within a <strong className='uppercase'>sorted array</strong>. It repeatedly divides the search interval in half, significantly reducing the number of comparisons needed compared to <Link href={`/algorithms/search/linear`} className='text-blue-500'>linear search.</Link></p>
          </header>
          <br />
          <main>
            <div>
              <p>Steps that binary algorithm takes to find the target value:</p>

              <ul>
                <li><b>Step 1:</b> Compare the target element with the middle element of the array.</li>
                <li><b>Step 2:</b> If the target is equal to the middle element, the search is complete.</li>
                <li><b>Step 3:</b> If the target is less than the middle element, repeat the search on the left half of the array.</li>
                <li><b>Step 4:</b> If the target is greater than the middle element, repeat the search on the right half of the array.</li>
              </ul>

              <p>This process of halving the search interval continues until the target element is found or the interval is empty, indicating that the target is not present in the array.</p>

            </div>
          </main>
          <br />
          <footer>
            <p>In conclusion, the time complexity of the binary search algorithm is <b>O(log n)</b>, as Big O Notation dictates, it efficiently narrows down the search space by halving it with each step, making it <b>significantly faster than linear search</b> for large, sorted arrays.</p>
          </footer>
        </article>

        } className="self-start" />

      </div>
      <OperationsContainer>
        {!array ? <Section>
          <div className='self-center flex items-center gap-3'>

            <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'forward' ? false : true} onCheckedChange={() => {
              toggleDirection()
            }} /></div>
          </div>

          <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="size" className="text-black w-32 text-center" type="number" min={0} />

            <ButtonAction title="create array" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={handleCreate} />

          </InputWithButtonContainer>



        </Section> : <Section className='gap-2 w-full'>
          <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="value" className="text-black w-32 text-center" type="number" />

            <ButtonAction title="Search" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning} onClick={async () => {
              await handleSearch()
            }} />

          </InputWithButtonContainer>
        </Section>
        }  {array && array.length ? <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={() => {
          reset()

        }} /> : null}
      </OperationsContainer>
      <div className='w-full items-end justify-between flex'>

        <Properties properties={{

          'Direction': {
            value: direction,
            show: true
          },
          maxSize: {
            value: maxSize
          },
          arraySize: {
            value: array?.length || null,
            show: !!array
          }

        }} />
        {array && <PopOverComponent content={
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
        } trigger={<Button size={'icon'} variant={'ghost'} className='hover:bg-transparent'><Wrench color="white" /></Button>} />}

      </div>
     <ArrayComponent array={array} setAnimationRunning={setAnimationRunning}/>
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={error ? true : false} showTrigger={false} description={error.description} />}
    </Main>
  )
}
