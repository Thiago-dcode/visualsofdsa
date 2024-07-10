'use client'

import { useRef, useState } from "react"
import Node from "../_classes/Node"
import { Primitive } from "@/types"
import Main from "@/components/container/Main"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import ButtonWithInput from "../_components/ButtonWithInput"
import { Input } from "@/components/ui/input"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { Button } from "@/components/ui/button"
import { PopOverComponent } from "@/components/ui/PopOverComponent"
import { Wrench } from "lucide-react"

import LinearDsConfig from "../_components/LinearDsConfig"


export default function StaticArray() {
    const [array, setArray] = useState<Node<Primitive>[] | null>(null)
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const maxSize = useRef(20);
    const [data, setData] = useState<string>('');
    const search = () => {

    }

    const write = () => {


    }
    // const push = () => {


    // }
    // const pop = () => {


    // }
    // const shift = () => {


    // }


    return (
        <Main className="">
            <OperationsContainer>
                <div className="flex  items-center gap-5 justify-center">
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />
                        <Input placeholder="index" className="text-black w-20" onChange={(e) => {

                        }} type="number" min={0} />
                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {

                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {

                            write()

                        }} />
                    </InputWithButtonContainer>

                </div>

                <PopOverComponent content={
                    <div>

                    </div>
                } trigger={<Button><Wrench color="white" /></Button>} />
            </OperationsContainer>

          
<div className=  "w-full overflow-auto flex items-center justify-start  p-4 ">



                <div className=" border-4  flex items-center justify-start">



                    {
                        [...Array(maxSize.current)].map((i) => {

                            return (
                                <div className="border border-white w-[50px] h-[50px]" key={'static-array-empty-' + i}>


                                </div>
                            )

                        })

                    }
              
            </div>
            </div>

        </Main>
    )
}
