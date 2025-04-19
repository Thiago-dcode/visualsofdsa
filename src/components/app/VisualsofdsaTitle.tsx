import { cn } from '@/lib/utils';
import React from 'react'

export default function VisualsofdsaTitle({title,className}:{title:string,className?:string}) {

    const titleArray = title.trim().split('');
    let currentIndex = 0;
    const titleArrayWithColors = titleArray.map((char,index)=>{
        if(char === " "){
            return <span key={index} className='ml-2' > </span>
        }
        const ele = <span key={index} className={cn("",{
            "text-app-bauhaus-red":currentIndex === 0,
            "text-app-bauhaus-yellow":currentIndex === 1,
            "text-app-bauhaus-blue":currentIndex === 2,
            "text-app-bauhaus-green":currentIndex === 3,
            "text-app-bauhaus-indigo":currentIndex === 4,
        })}>{char}</span>
        if(currentIndex === 4){
            currentIndex = 0;
        }else{
            currentIndex++;
        }
        return ele;
    })
  return (
    <div className={cn("flex flex-row",className)}>
        {titleArrayWithColors}
    </div>
  )
}
