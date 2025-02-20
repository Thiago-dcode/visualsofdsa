'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, { useEffect, useRef } from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import { useBinarySearchTree } from './hooks/useBinarySearchTree'
import TreeVisualization from '../tree/_components/visualizations/treeVisualization'
import '@/entities/data-structures/non-linear/tree/animation.css'
import { useAnimationRunning } from '@/context/animationRunningContext'
import Node from '../../linear/_classes/Node'
import { Primitive } from '@/types'
import { animate } from '@/lib/animations'
import { Edge } from '@/lib/classes/Edge'
import BinaryTreeNode from '../tree/_classes/BinaryTreeNode'
function BinarySearchTreeView() {

  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
  const { binarySearchTree, treeObj, insert, insertAnimation } = useBinarySearchTree();
  const inputRef = useRef<HTMLInputElement>(null);

  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node)
    node.isLastAdd = false;
    setAnimationRunning(false);
  }
  const onCreateEdgeAnimation = async (edge: Edge) => {

    await animate(edge.ref, `lit-node-edge ${0.5}s`, () => { }, true);
  }
  const mock = async (arr: number[]) => {

    arr.forEach(async (n) => await insert(n))
  }
  useEffect(() => {
mock([100,200,50,150,250,75,25,10,234,24,245,20,68,88,123,65,984])
    // mock([100, 101, 102, 103, 104, 105, 106, 107, 99, 98, 97, 96, 95, 94, 93])
  }, [])


  return (
    <>
      <OperationsContainer>

        <InputWithButtonContainer key={'insert-action-bts'}>
          <Input ref={inputRef} placeholder="number" className="text-black w-32 text-center" type="number" />
          <ButtonAction title="Insert" action='insert' isLoading={false} onClick={async () => {
            if (!inputRef.current) return;
            const num = parseFloat(inputRef.current.value);
            if (isNaN(num)) return;
            setAnimationRunning(true)
            await insert(num)
            setAnimationRunning(false)
          }} />
        </InputWithButtonContainer>



      </OperationsContainer>

      {treeObj ? <TreeVisualization<number, BinaryTreeNode<number>> onInsertAnimation={onInsertAnimation} onCreateEdgeAnimation={onCreateEdgeAnimation} tree={binarySearchTree} treeObj={treeObj} /> : null}

    </>
  )
}

export default BinarySearchTreeView