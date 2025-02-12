'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React, { useEffect, useRef } from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'
import { useBinarySearchTree } from './hooks/useBinarySearchTree'
import TreeVisualization from '../tree/_components/visualizations/treeVisualization'

function BinarySearchTreeView() {

  const { binarySearchTree, treeObj, insert } = useBinarySearchTree();
  const inputRef = useRef<HTMLInputElement>(null);

  const mock = async (arr: number[]) => {

    arr.forEach(async (n) => await insert(n))
  }
  useEffect(() => {


 

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
            await insert(num)
          }} />
        </InputWithButtonContainer>



      </OperationsContainer>
      {treeObj ? <TreeVisualization tree={binarySearchTree} treeObj={treeObj} /> : null}
    </>
  )
}

export default BinarySearchTreeView