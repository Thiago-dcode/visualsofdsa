'use client'
import Properties from '@/components/app/Properties'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import Main from '@/components/container/Main'
import OperationsContainer from '@/components/container/OperationsContainer'
import Section from '@/components/container/Section'
import Info from '@/components/ui/info'
import { Input } from '@/components/ui/input'
import { PopUp } from '@/components/ui/PopUp'
import { Switch } from '@/components/ui/switch'
import Title from '@/components/ui/Title'
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction'
import useStaticArray from '@/entities/data-structures/linear/static-array/hooks/useStaticArray'
import { Direction, speed, VisualizationArrays } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import useSearchAlgorithm from './_hooks/useSearchAlgorithm'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import RenderVisualization from '../_components/visualization/renderVisualization'
import Link from 'next/link'
import VisualizationTypes from '../_components/visualization/visualizationTypes'
import { AlgoSearchType } from '../types'
import { useVisualizationArray } from '@/hooks/useVisualizationArray'
import { useAnimationRunning } from '@/context/animationRunningContext'
import SpeedComponent from '@/components/app/speedComponent'
import { config } from '@/config'
import { useSpeed } from '@/hooks/useSpeed'
import ConfigComponent from '@/components/app/ConfigComponent'

export default function SearchView({ type }: {
  type?: AlgoSearchType
}) {

  const { array, maxSize, createSorted, createUnsorted, flush, error } = useStaticArray(500);
  const { speed, handleSetSpeed } = useSpeed(1, config.localStorageKeys.speed.sort)
  const [direction, setDirection] = useState<Direction>('ascending')
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const [sorted, setSorted] = useState(type === 'binary');
  const { visualizationMode, handleSetVisualizationMode } = useVisualizationArray('bars');
  const { binary, linear, message, clearMessage } = useSearchAlgorithm(array as Node<number>[] | null, sorted, direction, speed, visualizationMode);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleSorted = () => {
    setSorted(prev => !prev)
  }

  const toggleDirection = () => {
    setDirection(prev => prev === 'ascending' ? 'descending' : 'ascending')
  }
  const handleSearch = async () => {
    const searchValue = getValue();
    if (searchValue === null) return;
    setAnimationRunning(true);
    switch (type) {
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
    switch (type) {
      case 'linear':
        await !sorted ? createUnsorted(arraySize) : createSorted(arraySize, direction);
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


  const reset = () => {
    flush()
    resetValue();
    setAnimationRunning(false)
  }
  return (

    <>
      <OperationsContainer>
        {!array ? <Section>
          <div className='self-center flex items-center gap-3'>
            {type === 'linear' && <div className='flex self-center gap-2 items-center'>   <p>Sorted?</p><Switch defaultChecked={sorted} onCheckedChange={() => {
              toggleSorted()
            }} /></div>}
            {sorted && <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'ascending' ? false : true} onCheckedChange={() => {
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
              if (isAnimationRunning) return;
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
        {array && !isAnimationRunning && <VisualizationTypes setVisualization={handleSetVisualizationMode} visualizationSelected={visualizationMode} />}
        <ConfigComponent available={!!array && !isAnimationRunning} messageWhenNotAvailable="Array is not created yet or animation is running">
          <SpeedComponent setSpeed={handleSetSpeed} speed={speed} />
        </ConfigComponent>
      </div>
      {array ? <RenderVisualization direction={direction} sorted={type === 'binary' ? true : sorted} visualizationMode={visualizationMode} array={array as Node<number>[]} setAnimationRunning={setAnimationRunning} /> : null}
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={error ? true : false} showTrigger={false} description={error.description} />}

      {message && <PopUp title={message.title} buttonText="x" handleOnPopUpButton={() => {
        clearMessage()
      }} open={!!message} showTrigger={false} description={message.description} />}
    </>
  )
}
