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
import { Switch } from '@/components/ui/switch'
import Title from '@/components/ui/Title'
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction'
import MemoryAdressContainer from '@/entities/data-structures/linear/_components/MemoryAdressContainer'
import StaticArrayNodeComponent from '@/entities/data-structures/linear/staticArray/components/StaticArrayNodeComponent'
import useStaticArray from '@/entities/data-structures/linear/staticArray/hooks/useStaticArray'
import { MemorySize } from '@/types'
import React, { useEffect, useState } from 'react'

export default function LinearView() {
  const { array, sorted, direction, toggleDirection, toggleSorted, maxSize } = useStaticArray();
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const [arraySize, setArraySize] = useState(0);

  return (

    <Main>
      <div className='flex items-center justify-center gap-2'>
        <Title title={'Linear search'} />
        <Info title="Linear search" text={<article>
          <header>

            <p>Linear search or sequential search is a method for finding an element within an array by <b>sequentially checking</b> each element until a match is found or the entire list has been searched.</p>
          </header>
          <br />
          <main>
            <p>If the array is <strong>sorted</strong>, you can make the linear search algorithm more efficient by leveraging the order of elements:</p>
            <br />
            <div>
              <p>For example, if the target element is <b>greater</b> than the last element in a sorted array (or <b>less</b> than the last element in a reverse-sorted array), you can conclude that the target is not present and skip further checks.</p>

              <p>Another optimization involves checking the <b>next element in the loop</b>. If the next element (e.g., <Code>array[index + 1]</Code>) is <b>less</b> than the target element, you can safely conclude that the target is not in the array and break the loop.</p>
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
            <Input value={arraySize} placeholder="index" className="text-black w-20" onChange={(e) => {
              if (isAnimationRunning) return;
              const n = Number.parseInt(e.target.value);
              setArraySize(n)

            }} type="number" min={0} />

            <ButtonAction title="create" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {

            }} />

          </InputWithButtonContainer>



        </Section> : null}

      </OperationsContainer>
      <Properties properties={{
        'Sorted': sorted ? 'True' : 'False',
        'Direction': direction

      }} />
      <RamContainer>

        {array &&
          array.map((d, i) => {
            return (

              <MemoryAdressContainer size={MemorySize.L} index={i} showIndex={array && array[i] !== undefined ? true : false} key={'MemoryAdressContainer-' + i}>

                {array && array[i] ? <StaticArrayNodeComponent isLastNode={i === array.length - 1} setAnimationRunning={setAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}
              </MemoryAdressContainer>



            )

          })

        }

      </RamContainer>

    </Main>
  )
}
