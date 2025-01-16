import { animate } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { Primitive } from "@/types"
import { ValueOf } from "next/dist/shared/lib/constants"
import { useEffect, useRef, useState } from "react"
type Property = {
    value: Primitive,
    render?: boolean,
    show?: boolean
}
export type PropertiesType =
    { [id: string]: Property }
function Properties({ properties, className }: {
    properties: PropertiesType,
    className?: string,
}) {

    const prevProperties = useRef<typeof properties>()
    const handleAnimation = async (key: keyof PropertiesType, property: Property, ref: HTMLDivElement) => {

        const { value, render } = property;
        if (!prevProperties.current || !prevProperties.current[key] || (typeof render === 'boolean' && prevProperties.current[key].render === render) || (prevProperties.current[key].value === value)) {

            return
        };
        await animate(ref, 'animate-property 1s')
        prevProperties.current[key] = property

    }
    useEffect(() => {
        prevProperties.current = properties;

    }, [])

    return (
        <div className={cn("flex items-start  flex-col pl-4 -mt-4 gap-2", className)}>
            <h3 className=" font-bold">Properties: </h3>
            <div className="flex  items-start w-full flex-wrap  gap-4">

                {
                    properties && Object.entries(properties).map(([key, propertie], i) => {

                        if (propertie.show || (typeof propertie.show === 'undefined')) {
                            return (
                                <div ref={(ref) => {
                                    if (ref) (async () => {
                                        await handleAnimation(key, propertie, ref)
                                    })()

                                }} key={`propertie-${key}-${propertie.value}-${i}`} className=" px-3 text-center dark:border-app-off-white border-2 border-app-off-black rounded-md">
                                    <h4 className=" font-medium"><span className="font-bold">{key}</span>: {propertie.value}</h4>
                                </div>
                            )
                        }
                        return null
                    })

                }
            </div>

        </div>
    )
}

export default Properties