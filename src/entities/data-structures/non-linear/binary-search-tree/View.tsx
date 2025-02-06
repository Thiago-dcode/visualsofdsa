'use client'
import OperationsContainer from '@/components/container/OperationsContainer'
import React from 'react'
import ButtonAction from '../../linear/_components/ButtonAction'
import { Input } from '@/components/ui/input'
import InputWithButtonContainer from '@/components/container/InputWithButtonContainer'

function BinarySearchTreeView() {
  return (
    <>
      <OperationsContainer>

        <InputWithButtonContainer key={'insert-action-bts'}>
          <Input placeholder="number" className="text-black w-32 text-center" type="number" />
          <ButtonAction title="Insert" action='insert' isLoading={false} onClick={() => { }} />
        </InputWithButtonContainer>


      </OperationsContainer>
    </>
  )
}

export default BinarySearchTreeView