'use client'

import Main from "@/components/container/Main";
import { Button } from "@/components/ui/button";
import { UseStack } from "./hooks/UseStack";
import { useEffect, useState } from "react";
import Info from "@/components/ui/info";
import { PopUp } from "@/components/ui/PopUp";
import { Wrench } from "lucide-react";
import { PopOverComponent } from "@/components/ui/PopOverComponent";
import LinearDsConfig from "../_components/LinearDsConfig";
import OperationsContainer from "@/components/container/OperationsContainer";
import PushData from "../_components/ButtonWithInput";
import ButtonAction from "../_components/ButtonAction";
import LinearDsContainer from "../_components/LinearDsContainer";
import UseLinear from "../_hooks/UseLinear";
import PropertiesList from "../_components/PropertiesList";
import StackNodeComponent from "./components/StackNodeComponent";
import Title from "@/components/ui/Title";
import { useAnimationRunning } from "@/context/animationRunningContext";
import { LinearDsActions } from "../staticArray/type";

const Stack = () => {
  const { stack, push, pop, isStackOverFlow, handlePushAnimation, setIsStackOverFlow } = UseStack();
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const { fill, flush, isFilling, _render, render, empty, peek } = UseLinear(stack)
  const [nodeData, setNodeData] = useState('');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<LinearDsActions>('push')

  return (
    <>
      {stack && <Main>
        <div className='flex items-center justify-center gap-2'>
          <Title title={'Stack'} />
          <Info title="STACK" text={
            <article>
              <p>  A stack is <b>a linear data structure</b> that follows the <b>Last In, First Out (LIFO)</b> principle. This means that the last element added to the stack is the first one to be removed. Stacks are commonly used in various algorithms and applications, such as managing function calls, undo mechanisms in software, and evaluating expressions.</p>

              <h4 className="font-semibold py-2"> Key Operations of a Stack:</h4>

              <ul>

                <li>
                  <b className="font-semibold text-green-400"> Push: </b>This operation <b>adds an element to the top of the stack</b>. When a new element is pushed onto the stack, it becomes the new top element. The previous top element is now just below the new top element. <br /><b>Time complexity: O(1).</b>
                </li>
                <br />
                <li>
                  <b className="font-semibold text-red-400"> Pop: </b>This operation <b>removes and returns the top element of the stack</b>. Since the stack follows the LIFO principle, the element that was most recently added is the one that is removed. If the stack is empty, attempting to pop an element will usually result in an error or an undefined value. <br /><b>Time complexity: O(1).</b>
                </li>
                <br />
                <li> <b className="font-semibold text-yellow-400"> Peek: </b> This operation <b>returns the top element of the stack without removing it</b>. It allows you to inspect the element at the top of the stack without modifying the stack&apos;s state. This is useful when you need to see what the top element is without altering the stack. <br /><b>Time complexity: O(1).</b> </li>

              </ul></article>} className="self-start" />

        </div>
        {/* //ACTION BUTTONS: */}
        {<OperationsContainer open={open} setOpen={setOpen}>
          <div className="flex  items-center gap-2 justify-center">
            <PushData action="write" data={nodeData} setData={setNodeData} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true);
              setAction('push');
              await push(nodeData || 'let x = 50');
            }} isLoading={isAnimationRunning || isFilling} />
            {stack.size > 0 && <ButtonAction action="delete" title="pop" isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              setAction('pop');
              await pop(() => {
                setAnimationRunning(false)
              });
            }} />
            }
            {stack.size > 0 && <ButtonAction title="peek" action="read" isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              setAction('peek');
              await peek(() => {
                setAnimationRunning(false)
              });

            }} />
            }
          </div>

          <ButtonAction action="search" title="run" className='bg-blue-400 hover:bg-blue-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning || isFilling} onClick={async () => {
            if (isFilling || isStackOverFlow) return;
            setOpen(false)
            setAnimationRunning(true)
            setAction('fill')
            await fill(0, stack.maxSize - stack.size, (data) => {

              render();
              return push(data)


            });
            setAction('pop')
            await empty(() => {
              return pop(() => {
              })
            });
            setAnimationRunning(false)
          }} />

        </OperationsContainer>
        }



        {/* //STATIC PROPERTIES AND CONFIG: */}
        <div className="flex  justify-between w-full px-4">
          <PropertiesList trigger={[isAnimationRunning, _render]} list={stack} />
          {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={stack} />
            } trigger={<Button variant={'ghost'}><Wrench /></Button>} />
          </div>}

        </div>

        <LinearDsContainer linearDs={stack}>
          {
            stack.size > 0 && stack.toNodeArray.map((node, i) => {
              return (
                <StackNodeComponent action={action} setAnimationIsRunning={setAnimationRunning} handlePushAnimation={handlePushAnimation} height={stack.nodeHeight} key={'stackNode-' + i} node={node} id={i} />
              )
            })
          }
        </LinearDsContainer>

        <PopUp title="StackOverFlowError" buttonText="dismiss" handleOnPopUpButton={() => {
          flush(() => {
            setAnimationRunning(false)
            setIsStackOverFlow(false)
          });
        }} open={isStackOverFlow} showTrigger={false} description={`A Stack overflow error has ocurred. Stack maximum size of ${stack.maxSize} exceeded.`} />


      </Main>}
    </>
  )
}

export default Stack;