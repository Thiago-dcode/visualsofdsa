import React, { useEffect, useRef, useState } from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Direction, Primitive } from '@/types'
import Bar from './bar'
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes, getValueNormalized } from '@/lib/utils'

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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [barWidth, setBarWidth] = useState<number>(0);
  const minXValue = arrayIsSorted ? array[direction === 'forward' ? 0 : array.length - 1].data : getMinInAnArrayOfNodes(array);
  const maxXValue = arrayIsSorted ? array[direction === 'forward' ? array.length - 1 : 0].data : getMaxInAnArrayOfNodes(array);

  // Helper function to normalize and calculate height
  const calculateHeight = (value: number): number => {
    const valueNormalized = getValueNormalized(value, minXValue, maxXValue, [0.1, 2.1]);
    return valueNormalized * (maxBarSize / 2.1);
  };
  useEffect(() => {
 
    
    const event = (e: UIEvent) => {
      if (!containerRef.current) return;
      setBarWidth(containerRef.current.offsetWidth / array.length)
    }
    window.addEventListener('resize', event);
    return () => window.removeEventListener('resize', event);

  }, [])

  return (
   
      <div ref={(e) => {
        if (!e) return;
        setBarWidth(e.offsetWidth / array.length)
      
        containerRef.current = e;
      }} style={{
        height: (maxBarSize) + 'px',

      }} className="flex items-end justify-start w-full">
        { containerRef.current && array.map((node, i) => (
          <Bar
            width={barWidth }
            key={`bar-component-${node?.data}-${node?.id}`}
            height={calculateHeight(node.data)}
            node={node}
            className={`${i % 2 !== 0 ? 'dark:bg-app-off-white bg-app-off-black/80' : 'bg-app-bauhaus-green/70 '} border-0 border-r-[1px]  dark:border-r-app-bg-black border-r-app-off-white`}
          />
        ))}
      </div>

   
  );
}