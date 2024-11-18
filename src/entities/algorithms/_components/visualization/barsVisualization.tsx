import React from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Primitive } from '@/types'
export default function BarsVisualization({array,setAnimationRunning}:{
    array: (Node<Primitive>|null)[] | null,
    setAnimationRunning: (e:boolean)=>void
}) {
  return (
    <div >BarsVisualization</div>
  )
}
