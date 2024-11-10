import RamContainer from '@/components/container/RamContainer'
import Node from '@/entities/data-structures/linear/_classes/Node'
import MemoryAdressContainer from '@/entities/data-structures/linear/_components/MemoryAdressContainer'
import StaticArrayNodeComponent from '@/entities/data-structures/linear/staticArray/components/StaticArrayNodeComponent'
import { MemorySize, Primitive } from '@/types'
import React from 'react'

export default function ArrayComponent({array,setAnimationRunning}:{
    array: (Node<Primitive>|null)[] | null,
    setAnimationRunning: (e:boolean)=>void
}) {
  return (
    <RamContainer>

    {array &&
      array.map((d, i) => {
        return (

          <MemoryAdressContainer size={MemorySize.L} index={i} showIndex={false} key={'MemoryAdressContainer-' + i + d?.data + d?.id}>

            {array && array[i] ? <StaticArrayNodeComponent action={''} isLastNode={i === array.length - 1} setAnimationRunning={setAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}
          </MemoryAdressContainer>



        )

      })

    }

  </RamContainer>
  )
}
