import React from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Primitive, VisualizationAlgorithms } from '@/types'
import MemoryRamVisualization from './memoryRamVisualization'
import BarsVisualization from './barsVisualization'

export default function RenderVisualization({array,setAnimationRunning,visualizationMode}:{
    array: (Node<Primitive>|null)[] | null,
    setAnimationRunning: (e:boolean)=>void,
    visualizationMode: VisualizationAlgorithms
}) {
    const render = ()=>{
        switch (visualizationMode) {
            case 'memoryRam':
                
              return <MemoryRamVisualization array={array}setAnimationRunning={setAnimationRunning}/>
              case 'bars':
              return <BarsVisualization array={array}setAnimationRunning={setAnimationRunning}/>
            default:
                return null;
        }
    }
  return render()
}
