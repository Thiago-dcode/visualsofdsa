'use client'
// import { useState } from "react"
import Main from "@/components/container/Main"
import RamConteiner from "@/components/container/RamConteiner"
// import OperationsContainer from "@/components/container/OperationsContainer"
// import ButtonAction from "../_components/ButtonAction"
// import { Input } from "@/components/ui/input"
// import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { prefix0 } from "@/lib/utils"
import useDynamicArray from "./hooks/useDynamicArray"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
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


export default function DynamicArray() {
    const { array } = useDynamicArray();
    return (
        <Main className="">

            <RamConteiner>
                {array &&
                    array.map((node, i) => {
                        return (
                            <MemoryAdressContainer index={i} showIndex={node !== null} key={'memoryAdressContainer-' + i}>
                                {node !== null ? <div>{node.data}</div>: <p className="border-2 flex items-center justify-center
                     border-white/50 w-full h-full">NULL</p>}
                            </MemoryAdressContainer>

                        )
                    })
                }

            </RamConteiner>

        </Main >
    )
}
