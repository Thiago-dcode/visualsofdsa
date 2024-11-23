import React, { useEffect, useRef, useState } from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Direction, Primitive } from '@/types'
import Bar from './bar'
import { calculateRuleOfThree, getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes, getValueNormalized, removePx } from '@/lib/utils'

export default function BarsVisualizationSorted({
  array,
  setAnimationRunning,
  direction,
  maxBarSize = 650,
  arrayIsSorted 
}: {
  array: Node<number>[];
  setAnimationRunning: (e: boolean) => void;
  direction: Direction;
  maxBarSize?: number;
  arrayIsSorted: boolean
}) {
 


  const minXValue = arrayIsSorted? array[direction ==='forward'?0:array.length-1].data: getMinInAnArrayOfNodes(array);
  const maxXValue = arrayIsSorted? array[direction ==='forward'?array.length-1:0].data:getMaxInAnArrayOfNodes(array);
  console.log(arrayIsSorted);
  console.log(minXValue);
  console.log(maxXValue);
  // Helper function to normalize and calculate height
  const calculateHeight = (value: number): number => {
    //x′′=2x−minxmaxx−minx−1
    const valueNormalized = getValueNormalized(value,minXValue,maxXValue,[ 0,2]);
    return valueNormalized * (maxBarSize/2);
  };



  return (
    <div style={{
      height: (maxBarSize )+'px'
    }} className="flex items-end justify-center gap-2 w-full self-center">
      { array.map((node) => (
        <Bar
        width={30}
          key={`bar-component-${node?.data}-${node?.id}`}
          height={calculateHeight(node.data)}
          node={node}
        />
      )) }
    </div>
  );
}