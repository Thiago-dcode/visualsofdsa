'use client'
import Properties from '@/components/app/Properties'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import OperationsContainer from '@/components/container/OperationsContainer'
import Section from '@/components/container/Section'
import { Input } from '@/components/ui/input'
import { PopUp } from '@/components/ui/PopUp'
import { Switch } from '@/components/ui/switch'
import ButtonAction from '@/entities/data-structures/linear/_components/ButtonAction'
import useStaticArray from '@/entities/data-structures/linear/static-array/hooks/useStaticArray'
import { Direction, } from '@/types'
import React, {useRef, useState } from 'react'
import { toast } from 'sonner'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import RenderVisualization from '../_components/visualization/renderVisualization'
import VisualizationTypes from '../_components/visualization/visualizationTypes'
import { config } from '@/config'
import { AlgoSortType } from '../types'
import { useSortAlgorithms } from './_hooks/useSortAlgorithms'
import useResponsive from '@/hooks/useResponsive'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { useVisualizationArray } from '@/hooks/useVisualizationArray'
import SpeedComponent from '@/components/app/speedComponent'
import { useSpeed } from '@/hooks/useSpeed'
import { useToast } from '@/hooks/useToast'
export default function SortView({ type }: {
  type: AlgoSortType
}) {
  const maxBarSize = useRef(type !== 'merge' ? 650 : 300);
  const { array, maxSize, createUnsorted, flush, error } = useStaticArray(500)
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
  const [direction, setDirection] = useState<Direction>('ascending')
  const [open, setOpen] = useState(false);
  const { speed, handleSetSpeed } = useSpeed(1, config.localStorageKeys.speed.sort)
  const { visualizationMode, handleSetVisualizationMode } = useVisualizationArray('bars', async (vimValue) => {
    await handleResetAction(false,type === 'merge')
  });
  const { bubble, selection, insertion, merge, quick, message, clearMessage, isSorted, setUnsorted } = useSortAlgorithms(array as Node<number>[], speed, direction, visualizationMode);
  const tempValue = useRef<number>(undefined);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {toastInfo} = useToast();
  useResponsive(() => {
    //Every time the screen size is updated, will reset the array
    reset();
  })
  const handleResetAction = async (showToast: boolean = true,skip: boolean = false) => {
    if (!skip && !isSorted) {
      if (showToast) toastInfo('Array does not need to be reset, sort it first');
      return;
    }
    if (tempValue.current) {

      setAnimationRunning(true);
      await createUnsorted(tempValue.current)
      setUnsorted()
      setAnimationRunning(false);
    }
  }
  const handleSort = async () => {
    setOpen(false);
    setAnimationRunning(true);
    if (isSorted) {
      toast.info('Array is already sorted');

    } else {
      switch (type) {
        case 'bubble':
          await bubble();
          break;
        case 'selection':
          await selection();
          break;
        case 'insertion':
          await insertion();
          break;
        case 'merge':
          await merge(maxBarSize.current);
          break;
        case 'quick':
          await quick();
          break;
      }
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
    tempValue.current = value;
    return value;
  }
  const resetValue = () => {
    if (!inputRef.current) return null;
    inputRef.current.value = ''
  }
  const handleCreateAction = async () => {

    setAnimationRunning(true);
    const arraySize = getValue();
    if (arraySize !== null) createUnsorted(arraySize);


    setAnimationRunning(false)
    resetValue();

  }
  const toggleDirection = () => {
    setDirection(prev => prev === 'ascending' ? 'descending' : 'ascending');
  }
  const reset = () => {
    flush();
    setUnsorted();
    resetValue();
    setAnimationRunning(false)
  }


  return (

    <>
      <OperationsContainer open={open} setOpen={setOpen}>

        {!array ? <Section>


          <InputWithButtonContainer key={'linkedList-add-action'}>
            <Input ref={inputRef} placeholder="size" className="text-black w-32 text-center" type="number" min={0} />

            <ButtonAction title="create array" action='write' isLoading={isAnimationRunning} onClick={async () => {
              await handleCreateAction()
            }} />

          </InputWithButtonContainer>



        </Section> : <Section className='gap-2 w-full'>
          {!isSorted && <div className='flex self-center gap-2 items-center'> <p>Direction?</p><Switch defaultChecked={direction === 'ascending' ? false : true} onCheckedChange={() => {
            toggleDirection()
          }} /></div>}
          <ButtonAction title="Sort" action='read' isLoading={isAnimationRunning} onClick={async () => {
            await handleSort()
          }} />



        </Section>
        }
        <Section className='justify-end'>
          {array && array.length && isSorted ? <ButtonAction title="reset" action='fill' className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={async () => {
            await handleResetAction()

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
        {array && !isAnimationRunning && <VisualizationTypes setVisualization={handleSetVisualizationMode} visualizationSelected={visualizationMode} />}
        {array && !isAnimationRunning ? <PopOverComponent content={
          <SpeedComponent setSpeed={handleSetSpeed} speed={speed} />
        } trigger={<Button size={'icon'} variant={'ghost'} ><Wrench /></Button>} /> : <div></div>}

      </div>
      {array ? <RenderVisualization direction={direction} maxBarSize={maxBarSize.current} sorted={false} visualizationMode={visualizationMode} array={array as Node<number>[]} setAnimationRunning={setAnimationRunning} /> : null}
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={!!error} showTrigger={false} description={error.description} />}
      {message && <PopUp title={message.title} buttonText="x" handleOnPopUpButton={() => {
        clearMessage()
      }} open={!!message} showTrigger={false} description={message.description} />}
    </>
  )
}
