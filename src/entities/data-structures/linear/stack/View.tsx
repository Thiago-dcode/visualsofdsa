'use client'
import { Button } from "@/components/ui/button";
import { UseStack } from "./hooks/UseStack";
import { useEffect, useState } from "react";

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
import { useAnimationRunning } from "@/context/animationRunningContext";
import { LinearDsActions } from "../static-array/type";

const Stack = () => {
  const { stack, push, pop, isStackOverFlow, handlePushAnimation, setIsStackOverFlow } = UseStack();
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const { fill, flush, isFilling, _render, render, empty, peek } = UseLinear(stack)
  const [nodeData, setNodeData] = useState('');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<LinearDsActions>('push')

  return (
    <>
      {stack && <>

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


      </>}
    </>
  )
}

export default Stack;