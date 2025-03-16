'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, { act, useEffect, useRef } from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import { useBinarySearchTree } from './hooks/useBinarySearchTree'
import TreeVisualization from '../tree/_components/visualizations/treeVisualization'
import '@/entities/data-structures/non-linear/tree/animation.css'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { animate } from '@/lib/animations'
import { Edge } from '@/lib/classes/Edge'
import BinaryTreeNode from '../tree/_classes/BinaryTreeNode'
function BinarySearchTreeView() {

  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const { binarySearchTree, treeObjFull, insert, search, insertAnimation,mock } = useBinarySearchTree();
  const insertInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleAction = async (action: 'insert' | 'search', input: HTMLInputElement | null) => {

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
      default:
        break;
    }

    input.value = ''

  }
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node)
    setAnimationRunning(false);
  }
  const onCreateEdgeAnimation = async (edge: Edge) => {

    await animate(edge.ref, `lit-node-edge ${0.5}s`, () => { }, true);
  }
 
  useEffect(() => {
    mock([200,100,300,50,150,250,350])

  }, [])


  return (
    <>
      <OperationsContainer>

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


      </OperationsContainer>


      {treeObjFull ? <TreeVisualization<number, BinaryTreeNode<number>> onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} tree={binarySearchTree} treeObjFull={treeObjFull} /> : null}

    </>
  )
}

export default BinarySearchTreeView