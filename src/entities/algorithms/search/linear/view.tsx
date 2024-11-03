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
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import useSearchAlgorithm from '../_hooks/useSearchAlgorithm'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { ArrayActions } from '@/entities/data-structures/linear/staticArray/type'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'

export default function LinearView() {
  const { array, maxSize, createUnsorted, createSorted, flush, error } = useStaticArray(500);
  const [speed, setSpeed] = useState<speed>(1)
  const { linear } = useSearchAlgorithm(array as Node<Primitive>[] | null, speed);
  const [sorted, setSorted] = useState(false);

  const [direction, setDirection] = useState<Direction>('forward')
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleSorted = () => {
    setSorted(prev => !prev)
  }
  const toggleDirection = () => {
    setDirection(prev => prev === 'forward' ? 'reverse' : 'forward')
  }
  const handleSearch = async () => {
    const searchValue = getValue();
    if (searchValue === null) return;
    setAnimationRunning(true);
    await linear(searchValue, sorted, direction);
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
    if (!sorted) await createUnsorted(arraySize)
    else {
      await createSorted(arraySize, direction)

    }
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
        <Title title={'Linear search'} />
        <Info title="Linear search" text={<article>
          <header>

            <p>Linear search or sequential search is a method for finding an element within an array by <b>sequentially checking</b> (or traverse) each element until a match is found or the entire list has been searched**.</p>
          </header>
          <br />
          <main>
            <p>**If the array is <strong>sorted</strong>, you can make the linear search algorithm more efficient by leveraging the order of elements:</p>
            <br />
            <div>
              <p>For example, if the target element is <b>greater</b> than the last element in a sorted array (or <b>less</b> than the last element in a reverse-sorted array), you can conclude that the target is not present and skip further checks.</p>

              <p>Another optimization involves checking the <b>next element in the loop</b>. If the next element (e.g., <code>array[index + 1]</code>) is <b>greater</b> than the <b>target</b> element, you can safely conclude that the target is not in the array and break the loop. For example, if you are looking for 5 in <code>[2, 4, 7]</code>, when you reach 4, you can check the next element (7), which is greater than 5, and determine that 5 cannot be found in the remaining array. (Note: the same principle applies in a reverse-sorted array.)</p>


            </div>
          </main>
          <br />
          <footer>
            <p>In conclusion, regardless of whether the array is sorted or unsorted, the time complexity of the linear search algorithm remains <b>O(n)</b>, as Big O Notation dictates, it always accounts for <b> the worst-case scenario </b> where all elements must be checked.</p>
          </footer>

        </article>
        } className="self-start" />

      </div>
      <OperationsContainer>
        {!array ? <Section>
          <div className='self-center flex items-center gap-3'>
            <div className='flex self-center gap-2 items-center'>   <p>Sorted?</p><Switch defaultChecked={sorted} onCheckedChange={() => {
              toggleSorted()
            }} /></div>
            {sorted ? <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'forward' ? false : true} onCheckedChange={() => {
              toggleDirection()
            }} /></div> : null}
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
          'Sorted': {
            value: sorted ? 'True' : 'False'
          },
          'Direction': {
            value: direction,
            show: sorted
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
      <RamContainer>

        {array &&
          array.map((d, i) => {
            return (

              <MemoryAdressContainer size={MemorySize.L} index={i} showIndex={array && array[i] !== undefined ? true : false} key={'MemoryAdressContainer-' + i + d?.data + d?.id}>

                {array && array[i] ? <StaticArrayNodeComponent action={''} isLastNode={i === array.length - 1} setAnimationRunning={setAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}
              </MemoryAdressContainer>



            )

          })

        }

      </RamContainer>
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={error ? true : false} showTrigger={false} description={error.description} />}
    </Main>
  )
}
