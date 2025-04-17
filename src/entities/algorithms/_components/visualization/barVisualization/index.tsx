import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Node from '@/entities/data-structures/linear/_classes/Node'
import { Direction, Primitive } from '@/types'
import Bar from './bar'
import { getMaxInAnArrayOfNodes, getMinInAnArrayOfNodes, getValueNormalized } from '@/lib/utils'
import { useDarkMode } from '@/context/darkModeContext'
const MAXBARWIDTH = 60;
export default function BarsVisualizationSorted({
  array,
  setAnimationRunning,
  direction,
  maxBarSize = 650,
  arrayIsSorted,

}: {
  array: Node<number>[];
  setAnimationRunning: (e: boolean) => void;
  direction?: Direction;
  maxBarSize?: number;
  arrayIsSorted: boolean,

}) {
  const theme = useDarkMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [barWidth, setBarWidth] = useState<number>(0);

  const minXValue = arrayIsSorted ? array[direction === 'ascending' ? 0 : array.length - 1].data : getMinInAnArrayOfNodes(array);
  const maxXValue = arrayIsSorted ? array[direction === 'ascending' ? array.length - 1 : 0].data : getMaxInAnArrayOfNodes(array);

  const calculateHeight = (value: number): number => {
    const valueNormalized = array.length > 1 ? getValueNormalized(value, minXValue, maxXValue, [0.1, 2.1]) : 2.1;
    return valueNormalized * (maxBarSize / 2.1);
  };
  const handleSetBarWidth = (newWidth: number) => {

    if (newWidth > MAXBARWIDTH) setBarWidth(MAXBARWIDTH);
    else setBarWidth(newWidth)
  }
  useEffect(() => {


    const event = (e: UIEvent) => {
      if (!containerRef.current) return;
      handleSetBarWidth(containerRef.current.offsetWidth / array.length)
    }
    window.addEventListener('resize', event);
    return () => window.removeEventListener('resize', event);

  }, [])

  return (

    <div className='w-full mb-40 h-full'>


      <div ref={(e) => {
        if (!e) return;
        handleSetBarWidth(e.offsetWidth / array.length)

        containerRef.current = e;
      }} style={{


      }} className="flex items-end justify-center w-full relative top-10">
        {barWidth && containerRef.current && <div style={
          {
            width: barWidth * array.length,
            height: (maxBarSize) + 'px',
            position: 'relative'
          }
        }>
          {array.map((node, i) => {

            return (

              <Bar
                bgColor={i % 2 !== 0 ? theme.isDark ? 'rgb(242 240 239)' : 'rgb(26 25 24 / 0.8)' : 'rgb(36 164 130 / 0.7)'}
                left={i * barWidth}
                bottom={node.position.y}
                width={barWidth}
                key={`bar-component-${node?.data}-${node?.id}-${i}`}
                maxBarSize={maxBarSize}
                height={calculateHeight(node.data)}
                node={node}
                className={`border-0 border-r-[1px]  dark:border-r-app-bg-black border-r-app-off-white`}
              />
            )
          })}

        </div>

        }

      </div>

    </div>


  );
}