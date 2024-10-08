import { cn } from "@/lib/utils"
import { Primitive } from "@/types"


function Properties({ properties,className }: {
    properties: { [id: string]: Primitive },
    className?: string,
}) {
    return (
        <div className={cn("flex items-start w-full flex-col pl-4 -mt-4 gap-3",className)}>
            <h3 className="text-xl font-bold">Properties: </h3>
            <div className="flex  items-start w-full flex-wrap  gap-4">

                {
                    properties && Object.entries(properties).map(([key, value], i) => {
                        return (
                            <div key={`propertie-${key}-${value}-${i}`} className="bg-white px-4 py-1 text-black rounded-md">
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