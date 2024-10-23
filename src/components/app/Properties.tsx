import { animate } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { Primitive } from "@/types"
import { useEffect, useRef, useState } from "react"


function Properties({ properties, className }: {
    properties: { [id: string]: Primitive },
    className?: string,
}) {
  
    const prevProperties = useRef<typeof properties>()
    const handleAnimation = async (key: string, value: Primitive, ref:HTMLDivElement) => {
        if (!prevProperties.current || prevProperties.current[key] === value ) return;
       
        await animate(ref, 'animate-property 1s')
        prevProperties.current[key] = value;

    }
    useEffect(() => {
        prevProperties.current = properties;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
   
    return (
        <div className={cn("flex items-start w-full flex-col pl-4 -mt-4 gap-3", className)}>
            <h3 className="text-xl font-bold">Properties: </h3>
            <div className="flex  items-start w-full flex-wrap  gap-4">

                {
                    properties && Object.entries(properties).map(([key, value], i) => {
                        
                        return (
                            <div ref={(ref) => {
                                if(ref) (async()=>{
                                    await handleAnimation(key, value,ref)
                                })()
                               
                            }} key={`propertie-${key}-${value}-${i}`} className="bg-white px-4 py-1 text-black rounded-md">
                                <h4 className=" font-bold text-lg">{key}: {value}</h4>
                            </div>
                        )
                    })

                }
            </div>

        </div>
    )
}

export default Properties