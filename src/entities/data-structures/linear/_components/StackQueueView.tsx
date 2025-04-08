'use client'
import { Button } from "@/components/ui/button";
import {  useCallback, useRef, useState } from "react";
import { PopUp } from "@/components/ui/PopUp";
import { Wrench } from "lucide-react";
import { PopOverComponent } from "@/components/ui/PopOverComponent";
import LinearDsConfig from "./LinearDsConfig";
import OperationsContainer from "@/components/container/OperationsContainer";
import PushData from "./ButtonWithInput";
import ButtonAction from "./ButtonAction";
import LinearDsContainer from "./LinearDsContainer";
import UseLinear from "../_hooks/UseLinear";
import StackQueueComponent from "./StackQueueComponent";
import { useAnimationRunning } from "@/context/animationRunningContext";
import { LinearDsActions } from "../static-array/type"
import { Primitive } from "@/types";
import Node from "../_classes/Node";
import Queue from "../queue/classes/Queue";
import Properties from "@/components/app/Properties";
import Stack from "../stack/classes/Stack";
import { random } from "@/lib/utils";
const StackQueueView = ({linearDsName}:{linearDsName:'stack'|'queue'}) => {
  const {current: StackOrQueue} = useRef(linearDsName === 'stack' ? new Stack() : new Queue())  
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const {linearDs,add,remove,peek,nodeArray,isStackOverFlow,flush,config,setConfig,handleAddAnimation,handleFillerAnimation,fill,dismissFillerToast,empty} = UseLinear(StackOrQueue)
  const [nodeData, setNodeData] = useState('');
  const [open, setOpen] = useState(false);

  const _handleAddAnimation = useCallback(async (node: Node<Primitive>) => {
   await handleAddAnimation(node)  
   setAnimationRunning(false)
    node.isLastAdd = false
  },[handleAddAnimation])
const _handleFillerAnimation = useCallback(async () => {
  if(!nodeArray) return;
  await handleFillerAnimation(nodeArray.filter(node => node.isFiller),()=>{


  });
  dismissFillerToast();
  await empty();
  setAnimationRunning(false);
},[handleFillerAnimation,nodeArray,empty])

  const handleAction = useCallback(async (action: LinearDsActions,actionCallback:Promise<any>) => {
    if ( isStackOverFlow || isAnimationRunning) return;
    setAnimationRunning(true)
    await actionCallback

   if(action !== 'add' && action !== 'fill') setAnimationRunning(false)
    

  },[isStackOverFlow,isAnimationRunning])

  return (
    <>

        {/* //ACTION BUTTONS: */}
        {<OperationsContainer open={open} setOpen={setOpen}>
          <div className="flex  items-center gap-2 justify-center">
            <PushData title={linearDsName === 'stack' ? 'push' : 'enqueue'} action="write" data={nodeData} setData={setNodeData} onClick={async () => {
              if(isAnimationRunning) return;
             await handleAction('add',add(nodeData || `data-${random(0,2345)}`))
            }} isLoading={isAnimationRunning } />
            {linearDs.size > 0 && <ButtonAction action="delete" title={linearDsName === 'stack' ? 'pop' : 'dequeue'} isLoading={isAnimationRunning } onClick={async () => {
              if(isAnimationRunning) return;
             await handleAction('remove',remove())
            }} />
            }
            {linearDs.size > 0 && <ButtonAction title="peek" action="read" isLoading={isAnimationRunning } onClick={async () => {
              if(isAnimationRunning) return;
             await handleAction('peek',peek())

            }} />
            }
          </div>

          <ButtonAction action="search" title="run" className='bg-blue-400 hover:bg-blue-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning} onClick={async () => {
         await handleAction('fill',fill())
          }} />

        </OperationsContainer>
        }
        {/* //STATIC PROPERTIES AND CONFIG: */}
        <div className="flex  justify-between w-full px-4">
          <Properties properties={{
    'size': {
        value: linearDs.size,
          },
    'isEmpty': {
        value: linearDs.isEmpty.toString(),
        render: linearDs.isEmpty
    },
    'isFull': {
        value: linearDs.isFull.toString(),
        render: linearDs.isFull
    },
    [`${linearDs.name} size`]: {
        value: linearDs.maxSize
    },
  }}/>
          {!isStackOverFlow && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig config={config} setConfig={setConfig} stack={linearDs} />
            } trigger={<Button variant={'ghost'}><Wrench /></Button>} />
          </div>}

        </div>

        <LinearDsContainer linearDs={linearDs}>
          {
            nodeArray && nodeArray.map((node, i) => {
              return (
                <StackQueueComponent linearDsName={linearDsName} setAnimationIsRunning={setAnimationRunning} handleAddAnimation={_handleAddAnimation} handleFillerAnimation={_handleFillerAnimation} height={linearDs.nodeHeight} key={'stackNode-' + i +'-'+node.data +'-'+node.id} node={node} id={i} />
              )
            })
}
        </LinearDsContainer>

        <PopUp title="StackOverFlowError" buttonText="dismiss" handleOnPopUpButton={() => {
          flush();
          setAnimationRunning(false);
        }} open={isStackOverFlow} showTrigger={false} description={`A Stack overflow error has ocurred. Stack maximum size of ${config.maxSize} exceeded.`} />


    </>
  )
}

export default StackQueueView;