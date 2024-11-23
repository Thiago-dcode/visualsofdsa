import Node from '@/entities/data-structures/linear/_classes/Node'
import React, { useCallback } from 'react'

export default function Bar({height,width= 20,node}:{
    height:number,
    width?:number,
    node:Node<number>
}) {
  const setRef = useCallback((ref:HTMLElement|HTMLDivElement|null)=>{
    if(!ref) return;
    node.ref = ref;
  },[node])
  return (
    <div style={{
      height: Math.abs(height) +'px',
      width:width+'px',
  
    
    
    }} ref={setRef} className='border-2 dark:border-app-off-white border-app-off-black'>{node.data}</div>
  )
}
