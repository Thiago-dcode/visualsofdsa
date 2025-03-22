'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, {useEffect, useRef } from 'react'
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

  function BinarySearchTreeView() {

  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const { treeLayout, insert, search, insertAnimation,mock,remove } = useBinarySearchTree();
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
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node)
    setAnimationRunning(false);
  }
  const onCreateEdgeAnimation = async (edge: Edge) => {

    await animate(edge.ref, `lit-node-edge ${0.5}s`, () => { }, true);
  }
  
  useEffect(() => {
    mock([50, 25, 75, 12, 37, 62, 87, 6, 18, 31, 43, 56, 68, 81, 93, 3, 9, 15, 21, 28, 34, 40, 46, 53, 59, 65, 71, 78, 84, 90, 96,34,6623,456,42,345,23,5,4,6,7,8,9,43,2,345,799,44,33456,95,3457,345,56,747,8,5,3455,8,41,42,43,43,45,46,48,1,0,1.5])

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

      </Section>
      </OperationsContainer>


        {treeLayout ? <TreeVisualization<number, BinaryTreeNode<number>> onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} treeLayout={treeLayout} /> : null}

    </>
  )
}

export default BinarySearchTreeView