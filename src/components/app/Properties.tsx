import { animate } from "@/lib/animations"
import { cn } from "@/lib/utils"
import { Primitive } from "@/types"
import { useCallback, useEffect, useRef } from "react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Menu } from "lucide-react"
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
    const menuRef = useRef<HTMLButtonElement>(null)
    const handleAnimation = useCallback(async (key: keyof PropertiesType, property: Property, ref: HTMLDivElement) => {

        const { value, render } = property;
        if (!prevProperties.current || !prevProperties.current[key] || (typeof render === 'boolean' && prevProperties.current[key].render === render) || (prevProperties.current[key].value === value)) {

            return
        };
        await animate(ref, 'animate-property', 1)
       if(menuRef.current) await animate(menuRef.current, 'animate-property-menu', 1)
        prevProperties.current[key] = property

    },[])
    useEffect(() => {
        prevProperties.current = properties;

    }, [properties])

    return (
       <>
        <div className={cn("hidden tablet:flex items-start  flex-col pl-4 -mt-4 gap-2", className)}>
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

        <div className='tablet:hidden'>
       <DropdownMenu>
            <DropdownMenuTrigger ref={menuRef} asChild className="flex items-center justify-center gap-2 cursor-pointer">
               
                <Menu />
              
            </DropdownMenuTrigger>
            <DropdownMenuContent className='dark:bg-app-bg-black bg-app-off-white text-app-text-black dark:text-app-off-white border border-app-bg-black dark:border-app-off-white px-2  flex flex-col items-center justify-start text-start gap-2 w-fit'>
                <p className="font-bold">Properties:</p>
                <div className="flex flex-col gap-2 ">
                {
                        properties && Object.entries(properties).map(([key, propertie], i) => {

                        if (propertie.show || (typeof propertie.show === 'undefined')) {
                            return (
                                <DropdownMenuItem  ref={(ref) => {
                                    if (ref) (async () => {
                                        await handleAnimation(key, propertie, ref)
                                    })()

                                }} key={`propertie-${key}-${propertie.value}-${i}`} className=" p-1 text-center dark:border-app-off-white border-2 border-app-off-black rounded-md">
                                    <h4 className=" font-medium"><span className="font-bold">{key}</span>: {propertie.value}</h4>
                                </DropdownMenuItem>
                            )
                        }
                        return null
                    })

                }
               </div>
           
            </DropdownMenuContent>
        </DropdownMenu>
       </div>
        </>
    )
}

export default Properties