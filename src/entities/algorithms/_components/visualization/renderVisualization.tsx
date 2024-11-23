import React from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Direction, Primitive, VisualizationAlgorithms } from '@/types'
import MemoryRamVisualization from './memoryRamVisualization'
import BarVisualization from './barVisualization'

export default function RenderVisualization({array,setAnimationRunning,visualizationMode,sorted,direction}:{
    array: (Node<number>)[] ,
    setAnimationRunning: (e:boolean)=>void,
    visualizationMode: VisualizationAlgorithms,
    sorted:boolean,
    direction:Direction
}) {
    const render = ()=>{
        switch (visualizationMode) {
            case 'memoryRam':  
              return <MemoryRamVisualization array={array}setAnimationRunning={setAnimationRunning}/>
              case 'bars':
                return  <BarVisualization arrayIsSorted={sorted} direction={direction} array={array}setAnimationRunning={setAnimationRunning} />
            default:
                return null;
        }
    }
  return render()
}
