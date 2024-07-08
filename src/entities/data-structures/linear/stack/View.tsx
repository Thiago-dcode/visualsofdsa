'use client'

import Main from "@/components/container/Main";
import { Button } from "@/components/ui/button";
import { UseStack } from "./hooks/UseStack";
import { useState } from "react";
import Info from "@/components/ui/info";
import { PopUp } from "@/components/ui/PopUp";
import { Wrench } from "lucide-react";
import { PopOverComponent } from "@/components/ui/PopOverComponent";
import LinearDsConfig from "../_components/LinearDsConfig";
import OperationsContainer from "@/components/container/OperationsContainer";
import PushData from "../_components/PushData";
import ButtonAction from "../_components/ButtonAction";
import LinearDsContainer from "../_components/LinearDsContainer";
import UseLinear from "../_hooks/UseLinear";
import PropertiesLinearDs from "../_components/PropertiesLinearDs";
import StackNodeComponent from "./components/StackNodeComponent";

const Stack = () => {
  const { stack, push, pop, isStackOverFlow, handlePushAnimation, setIsStackOverFlow } = UseStack();
  const [isAnimationRunning, setAnimationRunning] = useState(false);
  const { fill, flush, isFilling, _render, render, empty, peek } = UseLinear(stack)
  const [nodeData, setNodeData] = useState('');
  return (
    <>
      {stack && <Main>
        {/* //ACTION BUTTONS: */}
        {<OperationsContainer>
          <div className="flex  items-center gap-2 justify-center">
            <PushData data={nodeData} setData={setNodeData} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              await push(nodeData || 'let x = 50');
            }} isLoading={isAnimationRunning || isFilling} />
            {stack.size > 0 && <ButtonAction title="pop" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              await pop(() => {
                setAnimationRunning(false)
              });
            }} />
            }
            {stack.size > 0 && <ButtonAction title="peek" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow || isAnimationRunning) return;
              setAnimationRunning(true)
              await peek(() => {
                setAnimationRunning(false)
              });

            }} />
            }
          </div>
          <div className=" flex items-center gap-2">
            <ButtonAction title="run" className='bg-blue-400 hover:bg-blue-600' isLoading={isAnimationRunning || isFilling} onClick={async () => {
              if (isFilling || isStackOverFlow) return;

              await fill(0, stack.maxSize - stack.size, (data) => {

                setAnimationRunning(true)
                return push(data)


              });
              await empty(() => {
                return pop(() => {
                  setAnimationRunning(false)
                })
              });

            }} />
          </div>
        </OperationsContainer>
        } 
        {/* // STATIC PROPERTIES: */}
        <PropertiesLinearDs trigger={[isAnimationRunning, _render]} linearDs={stack} />

        {/* //EXTRA INFO AND CONFIG: */}
        <div className="flex  justify-between w-full px-4">
          <Info title="STACK" text={<article>
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
          {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={stack} />
            } trigger={<Button><Wrench color="white" /></Button>} />
          </div>}

        </div>

        <LinearDsContainer linearDs={stack}>
          {
            stack.size > 0 && stack.toNodeArray.map((node, i) => {
              return (
                <StackNodeComponent setAnimationIsRunning={setAnimationRunning} handlePushAnimation={handlePushAnimation} height={stack.nodeHeight} key={'stackNode-' + i} node={node} id={i} />
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