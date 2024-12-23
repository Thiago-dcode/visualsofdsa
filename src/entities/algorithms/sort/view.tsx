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
import useStaticArray from '@/entities/data-structures/linear/staticArray/hooks/useStaticArray'
import { Direction, speed, VisualizationArrays } from '@/types'
import React, { useRef, useState } from 'react'
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

export default function SortView({ algoSortType }: {
  algoSortType: AlgoSortType
}) {
  const maxBarSize = useRef(algoSortType !== 'merge' ? 650 : 300);
  const { array, maxSize, createUnsorted, flush, error } = useStaticArray(500)
  const [speed, setSpeed] = useState<speed>(1);
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const [direction, setDirection] = useState<Direction>('ascending')
  const [open, setOpen] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState<VisualizationArrays>(localStorage.getItem(config.visualizationMode.localStorageKeys.array) as VisualizationArrays | null || 'memoryRam');
  const { bubble, selection, insertion, merge, message, clearMessage, isSorted, setUnsorted } = useSortAlgorithms(array as Node<number>[], speed, direction, visualizationMode);
  const tempValue = useRef<number>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSetVisualizationMode = (vimValue: VisualizationArrays) => {
    localStorage.setItem(config.visualizationMode.localStorageKeys.array, vimValue);
    setVisualizationMode(vimValue);
  }
  useResponsive(() => {
    reset();
  })
  const handleSort = async () => {
    setOpen(false);
    setAnimationRunning(true);
    if (isSorted) {
      toast.info('Array is already sorted');

    } else {
      switch (algoSortType) {
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
  const handleCreate = async () => {

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
  const renderInfo = () => {

    switch (algoSortType) {

      case 'bubble':
        return (<div className='flex items-center justify-center gap-2'>
          <Title title={'Bubble sort'} />
          <Info title="Bubble sort" text={<article>
            <header>
              <p>
                Bubble Sort is a <b>simple sorting algorithm</b> that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted.
              </p>
            </header>
            <br />
            <main>
              <p>
                **Although Bubble Sort is easy to understand and implement, it is not efficient for large datasets. However, there are a few optimizations that can improve its performance in specific scenarios:
              </p>
              <br />
              <div>
                <p>
                  For example, if during a single pass through the array no swaps are made, it means the array is already sorted, and you can terminate the algorithm early. This optimization is called the <b>flagged optimization</b> and reduces unnecessary passes over a sorted or nearly sorted array.
                </p>
                <p>
                  Another optimization involves reducing the range of elements to compare in each pass. Since the largest element &quot;bubbles up&quot; to its correct position after each pass, you can ignore the last sorted elements in subsequent iterations. This decreases the number of comparisons over time.
                </p>
              </div>
            </main>
            <br />
            <footer>
              <p>
                In conclusion, while Bubble Sort is generally inefficient with a time complexity of  <b className='font-bold'>O(n²)</b> in the average and worst cases, these optimizations can improve its performance on specific datasets, such as nearly sorted arrays. However, its simplicity makes it a good choice for educational purposes and visualizations.
              </p>
            </footer>
          </article>

          } className="self-start" />

        </div>)
      case 'selection':
        return (<div className='flex items-center justify-center gap-2'>
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

        </div>)
      case 'insertion':
        return (<div className='flex items-center justify-center gap-2'>
          <Title title={'Insertion sort'} />
          <Info title="Insertion sort" text={<article>
            <header>
              <p>
                Insertion Sort is a <b>simple and intuitive sorting algorithm</b> that works by building the final sorted array one element at a time. It maintains a sorted region of the array and repeatedly inserts the next unsorted element into its correct position within the sorted region.
              </p>
            </header>
            <br />
            <main>
              <p>
                **Insertion Sort is particularly efficient for small datasets or arrays that are already partially sorted, as it minimizes the number of required comparisons and shifts.
              </p>
              <br />
              <div>
                <p>
                  For example, during each pass, the algorithm takes the first element of the unsorted region and compares it with the elements in the sorted region, moving elements one position to the right until the correct position is found. The element is then inserted into its correct position, and the sorted region expands.
                </p>
                <p>
                  This behavior makes Insertion Sort adaptive, meaning it performs fewer operations on nearly sorted arrays. It is often used as a building block for more complex algorithms or for sorting small subsets of data.
                </p>
              </div>
            </main>
            <br />
            <footer>
              <p>
                In conclusion, the time complexity of Insertion Sort is <b>O(n²)</b> in the worst case but <b>O(n)</b> in the best case, such as when the array is already sorted. Its simplicity, adaptability, and in-place sorting nature make it suitable for small or nearly sorted datasets, despite its limitations for large arrays.
              </p>
            </footer>
          </article>


          } className="self-start" />

        </div>)
      case 'merge':
        return (<div className='flex items-center justify-center gap-2'>
          <Title title={'Merge sort'} />
          <Info title="Merge sort" text={<article>
            <header>
              <p>
                <strong>Merge Sort</strong> is a <b>divide-and-conquer sorting algorithm</b> that splits the input array into smaller subarrays, sorts each subarray, and then merges them back together in sorted order. It is highly efficient for <strong>large datasets</strong> due to its <b>predictable time complexity</b> and <b>suitability for parallel processing</b>.
              </p>
            </header>
            <br />
            <main>
              <p>
                **Merge Sort works by <b>recursively dividing</b> the array into two halves until each subarray contains only a single element (or is empty). These smaller arrays are inherently sorted, and the algorithm proceeds to <strong>merge</strong> them in a way that maintains sorted order.
              </p>
              <br />
              <div>
                <p>
                  For example, if the array is <code>[38, 27, 43, 3, 9, 82, 10]</code>, Merge Sort first <b>divides</b> it into two halves: <code>[38, 27, 43]</code> and <code>[3, 9, 82, 10]</code>. Each of these halves is further divided until individual elements are isolated: <code>[38]</code>, <code>[27]</code>, <code>[43]</code>, and so on. The algorithm then <b>merges</b> these elements back together in sorted order, resulting in <code>[3, 9, 10, 27, 38, 43, 82]</code>.
                </p>
                <p>
                  During the <strong>merging phase</strong>, Merge Sort <b>compares</b> the smallest elements of each subarray and <b>appends</b> the smaller element to the resulting merged array. This process is repeated until all elements are merged. The <strong>merging step</strong> is key to the algorithm&apos;s efficiency, as it ensures that each merge operation processes only the required comparisons and shifts.
                </p>
                <p>
                  Merge Sort is a <b>stable algorithm</b>, meaning it preserves the <strong>relative order</strong> of elements with equal values. This property, combined with its <b>predictable performance</b>, makes it a popular choice for sorting <strong>large datasets</strong> or implementing complex systems like database queries and <b>external sorting</b> for data that exceeds memory capacity.
                </p>
              </div>
            </main>
            <br />
            <footer>
              <p>
                In conclusion, Merge Sort has a consistent <b>time complexity</b> of <strong>O(n log n)</strong> for all cases—best, average, and worst. Its <b>space complexity</b> is <strong>O(n)</strong> due to the additional arrays used during the merging process. While its memory usage can be a limitation, Merge Sort&apos;s <b>stability</b> and <strong>efficiency</strong> make it a powerful tool for sorting large datasets, particularly when the data cannot fit entirely in memory.
              </p>
            </footer>
          </article>



          } className="self-start" />

        </div>)
    }
  }

  return (

    <Main className='pb-20'>
      {renderInfo()}
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
            await handleSort()
          }} />



        </Section>
        }
        <Section className='justify-end'>
          {array && array.length && isSorted ? <ButtonAction title="reset" action='fill' className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={async () => {
            if (tempValue.current) {

              setAnimationRunning(true);
              await createUnsorted(tempValue.current)
              setUnsorted()
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
        {array && !isAnimationRunning && <VisualizationTypes setVisualization={handleSetVisualizationMode} visualizationSelected={visualizationMode} />}
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
      {array ? <RenderVisualization direction={direction} maxBarSize={maxBarSize.current} sorted={false} visualizationMode={visualizationMode} array={array as Node<number>[]} setAnimationRunning={setAnimationRunning} /> : null}
      {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
        reset()

      }} open={!!error} showTrigger={false} description={error.description} />}
      {message && <PopUp title={message.title} buttonText="x" handleOnPopUpButton={() => {
        clearMessage()
      }} open={!!message} showTrigger={false} description={message.description} />}
    </Main>
  )
}
