'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import '@/entities/data-structures/non-linear/tree/animation.css'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { Edge } from '@/lib/classes/Edge'
import BinaryTreeNode from '../tree/_classes/BinaryTreeNode'
import { useBinarySearchTree } from './hooks/useBinarySearchTree'
import TreeVisualization from '../tree/_components/visualizations/treeVisualization'
import Section from '@/components/container/Section'
import Properties from '@/components/app/Properties'
import { TraversalType } from '../tree/types'
import { useSpeed } from '@/hooks/useSpeed'
import { config } from '@/config'
import SpeedComponent from '@/components/app/speedComponent'
import ConfigComponent from '@/components/app/ConfigComponent'
import { useToast } from '@/hooks/useToast'
import WarningComponent from '@/components/app/WarningComponent'
import { DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import useResponsive from '@/hooks/useResponsive'
function BinarySearchTreeView() {

  const { toastInfo } = useToast();
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
  const [open, setOpen] = useState<boolean>(false);
  const { speed, handleSetSpeed } = useSpeed(3, config.localStorageKeys.speed.binarySearchTree)
  const { treeLayout, insert, search, insertAnimation, mock, remove, traverse, animateEdge, createRandomTree, clear, maxTreeSize, minInputValue, maxInputValue } = useBinarySearchTree(speed);
  const [nodeSize, setNodeSize] = useState<number>(35);
  const device = useResponsive()
  const insertInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const removeInputRef = useRef<HTMLInputElement>(null);
  const randomTreeInputRef = useRef<HTMLInputElement>(null);
  const traverseActions = useRef<TraversalType[]>(['preOrder', 'postOrder', 'inOrder', 'lvlOrder']);
  const handleAction = useCallback(async (action: 'insert' | 'search' | 'remove' | 'createRandomTree', input: HTMLInputElement | null) => {

    if (!input || isAnimationRunning) return;
    const num = parseFloat(input.value);
    if (isNaN(num) || (action !== 'createRandomTree' && (num < minInputValue || num > maxInputValue)) || (action === 'createRandomTree' && (num < 1 || num > maxTreeSize))) {
      toastInfo(`Input must be a number between ${action !== 'createRandomTree' ? `${minInputValue} and ${maxInputValue}` : `${0} and ${maxTreeSize}`}`);
      return;
    };
    setOpen(false);
    setAnimationRunning(true);
    switch (action) {
      case 'insert':
        await insert(num, () => {
          setAnimationRunning(false);
        });
        break;
      case 'search':
        await search(num);
        break;
      case 'remove':
        await remove(num);
        break;
      case 'createRandomTree':
        await createRandomTree(num);
        break;
    }
    if (action !== 'insert') setAnimationRunning(false)
    input.value = ''

  }, [isAnimationRunning]);

  const handleTraverse = useCallback(
    async (traverseType: TraversalType) => {
      if (!treeLayout.tree.root) return;
     
      setOpen(false);
      setAnimationRunning(true)
      await traverse(traverseType);
      setAnimationRunning(false)
      
    }
    , [treeLayout])
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node)
    setAnimationRunning(false);
  }
  const onCreateEdgeAnimation = async (edge: Edge) => {

    await animateEdge(edge, 0.5, true);
  }


const makeResponsive = useMemo(()=>{
  return treeLayout.tree.root&& device.twResponsive.laptop
},[device,treeLayout])

  return (
    <>
     {!makeResponsive && <OperationsContainer >

        <Section>
          <InputWithButtonContainer key={'insert-action-bts'}>
            <Input ref={insertInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-32 text-center" type="number" />
            <ButtonAction title="Insert" action='insert' isLoading={isAnimationRunning} onClick={async () => {
              await handleAction('insert', insertInputRef.current)

            }} />
          </InputWithButtonContainer>

          {treeLayout.tree.root && <>
            <InputWithButtonContainer key={'search-action-bts'}>
              <Input ref={searchInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-32 text-center" type="number" />
              <ButtonAction title="search" action='search' isLoading={isAnimationRunning} onClick={async () => {
                await handleAction('search', searchInputRef.current)

              }} />
            </InputWithButtonContainer>
            <InputWithButtonContainer key={'remove-action-bts'}>
              <Input ref={removeInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-32 text-center" type="number" />
              <ButtonAction title="remove" action='delete' isLoading={isAnimationRunning} onClick={async () => {
                await handleAction('remove', removeInputRef.current)

              }} />
            </InputWithButtonContainer>

            {treeLayout.tree.root && <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer bg-app-bauhaus-yellow text-app-off-black rounded-md px-2 py-1 font-semibold'>
              <p>Traverse</p>
            </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {traverseActions.current.map((action,i) => (
                    <DropdownMenuItem className='cursor-pointer' key={'traverse-action-' + action + i} onClick={async () => {
                      await handleTraverse(action)
                    }}>{action}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>}
          </>
          }

          <InputWithButtonContainer key={'create-random-tree-action-bts'}>
            <Input ref={randomTreeInputRef} placeholder="number" max={maxTreeSize} min={1} className="text-black w-32 text-center" type="number" />
            <ButtonAction title="Create Random Tree" action='fill' isLoading={isAnimationRunning} onClick={async () => {
              await handleAction('createRandomTree', randomTreeInputRef.current)
            }} />
          </InputWithButtonContainer>
          
          {treeLayout.tree.root && <ButtonAction title="Delete" action='delete' isLoading={isAnimationRunning} onClick={async () => {
            clear()

          }} />}
        </Section>
      </OperationsContainer>}

      <div className='w-full items-end justify-between flex'>

        <Properties className={makeResponsive ? 'hidden tablet:hidden laptop:flex' : ''} classNameMobile={makeResponsive ? 'block tablet:block laptop:hidden' : ''} properties={{
          maxTreeSize: {
            value: maxTreeSize,
          },

          TreeSize: {
            value: `${treeLayout.tree.size} nodes`,
          },
          TreeLeftMostNode: {
            value: treeLayout.tree.size > 0 ? treeLayout.tree.leftMostNode(treeLayout.tree.root)!.data : null,
            show: treeLayout.tree.size > 0,
          },
          TreeRightMostNode: {
            value: treeLayout.tree.size > 0 ? treeLayout.tree.rightMostNode(treeLayout.tree.root)!.data : null,
            show: treeLayout.tree.size > 0,
          },
          minNodeValue: {
            value: minInputValue,
          },
          maxNodeValue: {
            value: maxInputValue,
          },




        }} />
        {makeResponsive && <OperationsContainer  enabled={!isAnimationRunning} className='z-[104]' open={open} setOpen={setOpen} makeResponsive={makeResponsive}>

<Section makeResponsive={makeResponsive} className='z-[104]'>
  <InputWithButtonContainer key={'insert-action-bts'} makeResponsive={makeResponsive}>
    <Input ref={insertInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-24 text-center" type="number" />
    <ButtonAction title="Insert" action='insert' isLoading={isAnimationRunning} onClick={async () => {
      await handleAction('insert', insertInputRef.current)

    }} />
  </InputWithButtonContainer>

  {treeLayout.tree.root && <>
    <InputWithButtonContainer key={'search-action-bts'} makeResponsive={makeResponsive}>
      <Input ref={searchInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-24 text-center" type="number" />
      <ButtonAction title="search" action='search' isLoading={isAnimationRunning} onClick={async () => {
        await handleAction('search', searchInputRef.current)

      }} />
    </InputWithButtonContainer>
    <InputWithButtonContainer key={'remove-action-bts'} makeResponsive={makeResponsive}>
      <Input ref={removeInputRef} placeholder="number" min={minInputValue} max={maxInputValue} className="text-black w-24 text-center" type="number" />
      <ButtonAction title="remove" action='delete' isLoading={isAnimationRunning} onClick={async () => {
        await handleAction('remove', removeInputRef.current)

      }} />
    </InputWithButtonContainer>

    {treeLayout.tree.root &&<div className='flex items-start flex-col justify-start gap-2'>
      <h6 className='text-lg font-semibold'>Traversals:</h6>
      <div className='z-[105] flex items-center justify-center gap-1 flex-wrap'>
        
          {traverseActions.current.map((action,i) => (
            <ButtonAction className='cursor-pointer text-sm px-1' key={'traverse-action-' + action + i} onClick={async () => {
              await handleTraverse(action)
            }} title={action} action='read' isLoading={isAnimationRunning}/>
          ))}
        </div></div>}
  </>
  }

  <InputWithButtonContainer key={'create-random-tree-action-bts'} makeResponsive={makeResponsive}>
    <Input ref={randomTreeInputRef} placeholder="number" max={maxTreeSize} min={1} className="text-black w-24 text-center" type="number" />
    <ButtonAction title="Create Random Tree" action='fill' isLoading={isAnimationRunning} onClick={async () => {
      await handleAction('createRandomTree', randomTreeInputRef.current)
    }} />
  </InputWithButtonContainer>
  
  {treeLayout.tree.root && <ButtonAction title="Delete" action='delete' isLoading={isAnimationRunning} onClick={async () => {
    clear()

  }} />}
</Section>
</OperationsContainer>}
        <div className='flex items-center justify-center gap-4'>

          <ConfigComponent available={!!treeLayout.tree.root && !isAnimationRunning} messageWhenNotAvailable="Tree is not created yet or animation is running">
            <div className='flex flex-col items-start justify-start'>
              <div className='hidden tablet:block'>
              <p>Tree Size</p>
              <Input type="range" min={25} max={70} value={nodeSize} onChange={(e) => setNodeSize(parseInt(e.target.value))} />
              </div>
              <SpeedComponent title="Animation Speed" speed={speed} setSpeed={handleSetSpeed} />

            </div>
          </ConfigComponent>


          <WarningComponent title="Tree Balance Warning" warning={{
            message: "Highly unbalanced trees may cause:",
            warnings: ["Overlapping nodes in visualization", "Reduced search efficiency", "Poor performance in operations"]
          }} solution={{
            message: "Possible solution:",
            solutions: ["Use AVL Trees (coming soon on visualsofdsa)"]
          }} />
        </div>
      </div>

      {treeLayout ? <TreeVisualization<number, BinaryTreeNode<number>> onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} treeLayout={treeLayout} nodeSize={nodeSize} /> : null}

    </>
  )
}

export default BinarySearchTreeView