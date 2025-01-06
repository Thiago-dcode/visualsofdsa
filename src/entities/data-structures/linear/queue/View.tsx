'use client'
import { useState } from 'react'
import UseQueue from './hooks/UseQueue'
import Main from '@/components/container/Main';
import OperationsContainer from '@/components/container/OperationsContainer';
import { PopOverComponent } from '@/components/ui/PopOverComponent';
import { PopUp } from '@/components/ui/PopUp';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import Info from '@/components/ui/info';
import ButtonAction from '../_components/ButtonAction';
import LinearDsContainer from '../_components/LinearDsContainer';
import PushData from '../_components/ButtonWithInput';
import UseLinear from '../_hooks/UseLinear';
import QueueNodeComponent from './components/QueueNodeComponent';
import PropertiesList from '../_components/PropertiesList';
import LinearDsConfig from '../_components/LinearDsConfig';
import Title from '@/components/ui/Title';
import { useAnimationRunning } from '@/context/animationRunningContext';
import { LinearDsActions } from '../staticArray/type';
export default function Queue() {

  const { enqueue, queue, dequeue, isStackOverFlow, setIsStackOverFlow } = UseQueue();
  const [open, setOpen] = useState(false)
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const [action, setAction] = useState<LinearDsActions>("push")
  const { isFilling, fill, empty, _render, render, flush, peek } = UseLinear(queue)
  const [nodeData, setNodeData] = useState('let x = 25')
  return (
    <>
      {queue && <Main className="">
        <div className='flex items-center justify-center gap-2'>
          <Title title={'Queue'} />
          <Info title="QUEUE" text={<article>
            <p> A queue is <b>a linear data structure</b> that follows the <b>First In, First Out (FIFO)</b> principle. This means that the first element added to the queue is the first one to be removed. Queues are commonly used in various algorithms and applications, such as managing tasks in a printer, handling requests in web servers, and implementing breadth-first search (BFS) in graphs.</p>
            <br />
            <h4 className="font-semibold py-2"> Key Operations of a Queue:</h4>

            <ul>
              <li>
                <b className="font-semibold text-green-400"> Enqueue: </b>This operation <b>adds an element to the end of the queue</b>. When a new element is enqueued, it becomes the new rear element, and the previous rear element is now just before the new rear element. <br /><b>Time complexity: O(1).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-red-400"> Dequeue: </b>This operation <b>removes and returns the front element of the queue</b>. Since the queue follows the FIFO principle, the element that was first added is the one that is removed. If the queue is empty, attempting to dequeue an element will usually result in an error or an undefined value. <br /><b>Time complexity: O(1).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-yellow-400"> Front: </b> This operation <b>returns the front element of the queue without removing it</b>. It allows you to inspect the element at the front of the queue without modifying the queue&lsquo;s state. This is useful when you need to see what the front element is without altering the queue. <br /><b>Time complexity: O(1).</b>
              </li>
            </ul>
          </article>
          } className="self-start" />

        </div>
        {/* //ACTION BUTTONS: */}
        {<OperationsContainer open={open} setOpen={setOpen}>
          <div className="flex flex-wrap  items-end gap-2 justify-end">
            <PushData action='write' title='enqueue' data={nodeData} setData={setNodeData} onClick={async () => {
              if (isFilling || isAnimationRunning) return;

              setAnimationRunning(true)
              setAction('push')
              await enqueue(nodeData)

            }} isLoading={isFilling || isAnimationRunning} />
            {queue.size > 0 && <ButtonAction action='delete' title="dequeue" className='bg-red-400 hover:bg-red-600' isLoading={isFilling || isAnimationRunning} onClick={async () => {
              // console.log('DEQUEUE', isAnimationRunning)
              if (isFilling || isStackOverFlow || isAnimationRunning) return;

              setAnimationRunning(true);
              setAction('pop')
              await dequeue(() => {
                setAnimationRunning(false)

              })

            }} />
            }
            {queue.size > 0 && <ButtonAction action='read' title="front" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              setAction('peek')
              await peek(() => {
                setAnimationRunning(false);
              });

            }} />
            }
          </div>

          <ButtonAction title="run" action='search' className='bg-blue-400 hover:bg-blue-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning || isFilling} onClick={async () => {
            if (isFilling || isStackOverFlow) return;
            setOpen(false)
            setAnimationRunning(true)
            setAction("fill")
            await fill(0, queue.maxSize - queue.size, (data) => {
              render()
              return enqueue(data)
            });
            await empty(() => {
              render()
              return dequeue(() => {
              })
            });
            setAnimationRunning(false)

          }} />

        </OperationsContainer>
        }



        {/* STATIC PROPERTIES && CONFIG: */}
        <div className="flex  justify-between w-full px-4">
          <PropertiesList trigger={[isAnimationRunning, _render]} list={queue} />
          {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={queue} />
            } trigger={<Button variant={'ghost'}><Wrench /></Button>} />
          </div>}

        </div>

        <LinearDsContainer dsType='queue' linearDs={queue}>
          {
            queue.toNodeArray.map((node, i) => {

              return (

                <QueueNodeComponent action={action} setIsAnimationRunning={setAnimationRunning} queue={queue} height={queue.nodeHeight} key={`${queue.name}-node-${node.id}`} node={node} id={i} />

              )
            })
          }
        </LinearDsContainer>

        <PopUp title="StackOverFlowError" buttonText="dismiss" handleOnPopUpButton={() => {
          flush(() => {
            setAnimationRunning(false)
            setIsStackOverFlow(false)
          });
        }} open={isStackOverFlow} showTrigger={false} description={`A Stack overflow error has ocurred. Stack maximum size of ${queue.maxSize} exceeded.`} />


      </Main>}
    </>
  )
}
