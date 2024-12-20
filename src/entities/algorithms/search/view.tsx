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

import useStaticArray from '@/entities/data-structures/linear/staticArray/hooks/useStaticArray'
import { Direction, Primitive, speed, VisualizationArrays } from '@/types'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import useSearchAlgorithm from './_hooks/useSearchAlgorithm'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import RenderVisualization from '../_components/visualization/renderVisualization'
import Link from 'next/link'
import VisualizationTypes from '../_components/visualization/visualizationTypes'
import { config } from '@/config'
import { getMinInAnArrayOfNodes } from '@/lib/utils'

export default function SearchView({ searchType }: {
  searchType?: AlgoSearchType
}) {
  const { array, maxSize, createSorted,createUnsorted, flush, error } = useStaticArray(500);
  const [speed, setSpeed] = useState<speed>(1)
  const [direction, setDirection] = useState<Direction>('forward')
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const [sorted, setSorted] = useState(searchType==='binary');
  const [visualizationMode, setVisualizationMode] = useState<VisualizationArrays>(localStorage.getItem(config.visualizationMode.localStorageKeys.array) as VisualizationArrays | null || 'memoryRam');
  const { binary, linear } = useSearchAlgorithm(array as Node<number>[] | null,sorted,direction, speed,visualizationMode);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleSorted = () => {
    setSorted(prev => !prev)
  }
  const handleSetVisualizationMode = (vimValue:VisualizationArrays) =>{

    localStorage.setItem(config.visualizationMode.localStorageKeys.array,vimValue);
    setVisualizationMode(vimValue);

  }
  const toggleDirection = () => {
    setDirection(prev => prev === 'forward' ? 'reverse' : 'forward')
  }
  const handleSearch = async () => {
    const searchValue = getValue();
    if (searchValue === null) return;
    setAnimationRunning(true);
    switch (searchType) {
      case 'linear':
        await linear(searchValue);
        break;
      case 'binary':
        await binary(searchValue);
        break;

      default:
        break;
    }

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
    switch (searchType) {
      case 'linear':
        await !sorted? createUnsorted(arraySize):createSorted(arraySize,direction);
        break;
      case 'binary':
        await createSorted(arraySize, direction)
        break;

      default:
        break;
    }
   
    setAnimationRunning(false)
    resetValue();

  }
  const renderInfo = () => {

    switch (searchType) {

      case 'linear':
        return (<div className='flex items-center justify-center gap-2'>
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
  
        </div>)
      case 'binary':
        return ( <div className='flex items-center justify-center gap-2'>
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
  
        </div>)

    }
  }
  const reset = () => {
    flush()
    resetValue();
    setAnimationRunning(false)
  }
  return (

    <Main>
      {renderInfo()}
      <OperationsContainer>
        {!array ? <Section>
          <div className='self-center flex items-center gap-3'>
            {searchType === 'linear' && <div className='flex self-center gap-2 items-center'>   <p>Sorted?</p><Switch defaultChecked={sorted} onCheckedChange={() => {
              toggleSorted()
            }} /></div>}
            {sorted    &&   <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'forward' ? false : true} onCheckedChange={() => {
              toggleDirection()
            }} /></div>}
          </div>

        <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="size" className="text-black w-32 text-center" type="number" min={0} />

            <ButtonAction title="create array" action='write' isLoading={isAnimationRunning} onClick={handleCreate} />

          </InputWithButtonContainer>



        </Section> : <Section className='gap-2 w-full'>
          <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="value" className="text-black w-32 text-center" type="number" />

            <ButtonAction title="Search" action='read' isLoading={isAnimationRunning} onClick={async () => {
              await handleSearch()
            }} />

          </InputWithButtonContainer>
          
        </Section>
        }  {array && array.length ? <ButtonAction title="delete" action='delete' className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={() => {
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
        {array && !isAnimationRunning && <VisualizationTypes setVisualization={handleSetVisualizationMode} visualizationSelected={visualizationMode}/>}
        {array && !isAnimationRunning  ? <PopOverComponent content={
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
        } trigger={<Button size={'icon'} variant={'ghost'} ><Wrench /></Button>} />:<div></div>}

      </div>
    {array  ?  <RenderVisualization direction={direction} sorted={searchType==='binary'?true: sorted} visualizationMode={visualizationMode} array={array as Node<number>[]} setAnimationRunning={setAnimationRunning} />:null}
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={error ? true : false} showTrigger={false} description={error.description} />}
    </Main>
  )
}
