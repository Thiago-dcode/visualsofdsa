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
import PropertiesLinearDs from '../_components/PropertiesLinearDs';
import LinearDsConfig from '../_components/LinearDsConfig';
export default function Queue() {

  const { enqueue, queue, dequeue, isStackOverFlow, setIsStackOverFlow } = UseQueue();
  const [open, setOpen] = useState(false)
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const { isFilling, fill, empty, _render, render, flush, peek } = UseLinear(queue)
  const [nodeData, setNodeData] = useState('let x = 25')
  return (
    <>
      {queue && <Main className="">
        {/* //ACTION BUTTONS: */}
        {<OperationsContainer open={open} setOpen={setOpen}>
          <div className="flex flex-wrap  items-end gap-2 justify-end">
            <PushData title='enqueue' data={nodeData} setData={setNodeData} onClick={async () => {
              if (isFilling || isAnimationRunning) return;

              setAnimationRunning(true)
              enqueue(nodeData)

            }} isLoading={isFilling || isAnimationRunning} />
            {queue.size > 0 && <ButtonAction title="dequeue" className='bg-red-400 hover:bg-red-600' isLoading={isFilling || isAnimationRunning} onClick={async () => {
              // console.log('DEQUEUE', isAnimationRunning)
              if (isFilling || isStackOverFlow || isAnimationRunning) return;

              setAnimationRunning(true);
              await dequeue(() => {
                setAnimationRunning(false)

              })

            }} />
            }
            {queue.size > 0 && <ButtonAction title="front" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              await peek(() => {
                setAnimationRunning(false);
              });

            }} />
            }
          </div>

          <ButtonAction title="run" className='bg-blue-400 hover:bg-blue-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning || isFilling} onClick={async () => {
            if (isFilling || isStackOverFlow) return;
            setOpen(false)
            await fill(0, queue.maxSize - queue.size, (data) => {
              setAnimationRunning(true)
              return enqueue(data)
            });
            await empty(() => {
              return dequeue(() => {
              })
            });
            setAnimationRunning(false)

          }} />

        </OperationsContainer>
        }
        {/* // STATIC PROPERTIES: */}
        <PropertiesLinearDs trigger={[isAnimationRunning, _render]} linearDs={queue} />

        {/* //EXTRA INFO AND CONFIG: */}
        <div className="flex  justify-between w-full px-4">
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
          {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={queue} />
            } trigger={<Button><Wrench color="white" /></Button>} />
          </div>}

        </div>

        <LinearDsContainer dsType='queue' linearDs={queue}>
          {
            queue.toNodeArray.map((node, i) => {

              return (

                <QueueNodeComponent setIsAnimationRunning={setAnimationRunning} queue={queue} height={queue.nodeHeight} key={`${queue.name}-node-${node.id}`} node={node} id={i} />

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
