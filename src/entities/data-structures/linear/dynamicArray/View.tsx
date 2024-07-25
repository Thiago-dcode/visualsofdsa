'use client'
// import { useState } from "react"
 import Main from "@/components/container/Main"
// import OperationsContainer from "@/components/container/OperationsContainer"
// import ButtonAction from "../_components/ButtonAction"
// import { Input } from "@/components/ui/input"
// import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { prefix0 } from "@/lib/utils"
// import { PopUp } from "@/components/ui/PopUp"
// import StaticArrayNodeComponent from "./components/StaticArrayNodeComponent"
// import useStaticArray from "./hooks/useStaticArray"
// import './style.css'
// import { searchResult, staticArrayAction } from "./type"
// import Info from "@/components/ui/info"
// import Section from "@/components/container/Section"
// import UseLinear from "../_hooks/UseLinear"
// import { PopOverComponent } from "@/components/ui/PopOverComponent"
// import { Button } from "@/components/ui/button"
// import { Wrench } from "lucide-react"
// import LinearDsConfig from "../_components/LinearDsConfig"


export default function StaticArray() {
  
    return (
        <Main className="">

       sd
            {/* <div className="md:w-full flex items-center justify-center">



                <div className="w-full  flex-wrap gap-y-4 flex items-center justify-start">


                    {
                        [...Array(maxSize)].map((d, i) => {
                            const memoryAdress = '0x' + prefix0(i);
                            return (
                                <div key={'static-array-empty-' + i}>
                                    <div title={"Memory address: " + memoryAdress} className="text-sm flex items-center justify-center py-2 border border-white w-[80px] h-[15px]">
                                        <p>{memoryAdress}</p>
                                    </div>
                                    <div className="w-[80px] h-[80px]">
                                        {array && array[i] ? <StaticArrayNodeComponent action={action} setAnimationRunning={setIsAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}

                                    </div>
                                    <div title={"index: " + i} style={{
                                        visibility: array && array[i] ? 'visible' : 'hidden'
                                    }} className={"text-sm flex items-center justify-center py-2 border border-white w-[80px] h-[15px]"}>
                                        <p>{i}</p>
                                    </div>
                                </div>
                            )

                        })

                    }

                </div>
            </div> */}

 

        </Main >
    )
}
