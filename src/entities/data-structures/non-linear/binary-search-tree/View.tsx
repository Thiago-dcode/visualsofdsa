'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, { useEffect, useRef, useState } from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import '@/entities/data-structures/non-linear/tree/animation.css'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { animate } from '@/lib/animations'
import { Edge } from '@/lib/classes/Edge'
import BinaryTreeNode from '../tree/_classes/BinaryTreeNode'
import { useBinarySearchTree } from './hooks/useBinarySearchTree'
import TreeVisualization from '../tree/_components/visualizations/treeVisualization'
import Section from '@/components/container/Section'
import { PopOverComponent } from '@/components/ui/PopOverComponent'
import { Button } from '@/components/ui/button'
import { Wrench } from 'lucide-react'
import Properties from '@/components/app/Properties'
import { TraversalType } from '../tree/types'
import { useSpeed } from '@/hooks/useSpeed'
import { config } from '@/config'
import SpeedComponent from '@/components/app/speedComponent'

function BinarySearchTreeView() {

  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const {speed,handleSetSpeed}= useSpeed(3,config.localStorageKeys.speed.binarySearchTree)
  const { treeLayout, insert, search, insertAnimation, mock, remove ,traverse,animateEdge} = useBinarySearchTree(speed);
  const [nodeSize, setNodeSize] = useState<number>(35);

  const insertInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const removeInputRef = useRef<HTMLInputElement>(null);
  const handleAction = async (action: 'insert' | 'search' | 'remove', input: HTMLInputElement | null) => {

    if (!input || isAnimationRunning) return;
    const num = parseFloat(input.value);
    if (isNaN(num)) return;
    setAnimationRunning(true)
    switch (action) {
      case 'insert':
        await insert(num, () => {
          setAnimationRunning(false);
        });
        break;
      case 'search':
        await search(num);
        setAnimationRunning(false)
        break;
      case 'remove':
        await remove(num);
        setAnimationRunning(false)
        break;
    }

    input.value = ''

  }
  const handleTraverse = async (traverseType: TraversalType) =>{

    setAnimationRunning(true)
    await traverse(traverseType);
    setAnimationRunning(false)
  }
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node)
    setAnimationRunning(false);
  }
  const onCreateEdgeAnimation = async (edge: Edge) => {

    await animateEdge(edge,0.5,true);
  } 

  useEffect(() => {
    mock([50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93, 3, 9, 15, 21, 28, 34, 40, 46, 53, 59, 65, 71, 78, 84, 90, 96, 34, 6623, 456, 42, 345, 23, 5, 4, 6, 7, 8, 9, 43, 2, 345, 799, 44, 33456, 95, 3457, 345, 56, 747, 8, 5, 3455, 8, 41, 42, 43, 43, 45, 46, 48, 1, 0, 1.5])

  }, [])


  return (
    <>
      <OperationsContainer>

        <Section>
          <InputWithButtonContainer key={'insert-action-bts'}>
            <Input ref={insertInputRef} placeholder="number" className="text-black w-32 text-center" type="number" />
            <ButtonAction title="Insert" action='insert' isLoading={isAnimationRunning} onClick={async () => {
              await handleAction('insert', insertInputRef.current)

            }} />
          </InputWithButtonContainer>
          <InputWithButtonContainer key={'search-action-bts'}>
            <Input ref={searchInputRef} placeholder="number" className="text-black w-32 text-center" type="number" />
            <ButtonAction title="search" action='search' isLoading={isAnimationRunning} onClick={async () => {
              await handleAction('search', searchInputRef.current)

            }} />
          </InputWithButtonContainer>
          <InputWithButtonContainer key={'remove-action-bts'}>
            <Input ref={removeInputRef} placeholder="number" className="text-black w-32 text-center" type="number" />
            <ButtonAction title="remove" action='delete' isLoading={isAnimationRunning} onClick={async () => {
              await handleAction('remove', removeInputRef.current)

            }} />
          </InputWithButtonContainer>
          <ButtonAction title="PreOrderTraversal" action='read' isLoading={isAnimationRunning} onClick={async () => {
              await handleTraverse('preOrder')

            }} />
              <ButtonAction title="PostOrderTraversal" action='read' isLoading={isAnimationRunning} onClick={async () => {
              await handleTraverse('postOrder')

            }} />
          <ButtonAction title="InOrderTraversal" action='read' isLoading={isAnimationRunning} onClick={async () => {
              await handleTraverse('inOrder')

            }} />
              <ButtonAction title="LevelOrderTraversal" action='read' isLoading={isAnimationRunning} onClick={async () => {
              await handleTraverse('lvlOrder')

            }} />
            
        </Section>
      </OperationsContainer>

      <div className='w-full items-end justify-between flex'>

        <Properties properties={{
          TreeSize: {
            value: `${treeLayout.tree.size} nodes`,
          },
          TreeLeftMostNode: {
            value: treeLayout.tree.size > 0 ? treeLayout.tree.leftMostNode(treeLayout.tree.root)!.data : null,
          },
          TreeRightMostNode: {
            value: treeLayout.tree.size > 0 ? treeLayout.tree.rightMostNode(treeLayout.tree.root)!.data : null,
          },
          
        
          

        }} />
        {treeLayout.tree.root && !isAnimationRunning && <PopOverComponent className='self-end z-[2001]' content={
          <div className='flex flex-col items-start justify-start'>
            <p>Tree Size</p>
            <Input type="range" min={25} max={70} value={nodeSize} onChange={(e) => setNodeSize(parseInt(e.target.value))} />
            <SpeedComponent title="Traverse animation Speed" speed={speed} setSpeed={handleSetSpeed}/>

          </div>
        } trigger={<Button size={'icon'} variant={'ghost'} ><Wrench /></Button>} />}
      </div>

      {treeLayout ? <TreeVisualization<number, BinaryTreeNode<number>> onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} treeLayout={treeLayout} nodeSize={nodeSize} /> : null}

    </>
  )
}

export default BinarySearchTreeView