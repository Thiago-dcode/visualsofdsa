'use client'

import { useCallback, useRef, useState } from "react"
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
import { prefix0 } from "@/lib/utils"
import Position from "@/lib/classes/Position"
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError"
import { PopUp } from "@/components/ui/PopUp"
import ArrayNodeComponent from "./components/ArrayNodeComponent"


export default function StaticArray() {
    const [array, setArray] = useState<Node<Primitive>[] | null>(null)
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const maxSize = useRef(30);
    const [data, setData] = useState<string>('');
    const [size, setSize] = useState(0)
    const [index, setIndex] = useState(0);
    const [error, setError] = useState('')
    const create = useCallback(() => {
        if (size > maxSize.current) {
            throw new IndexOutOfBoundsError(`A Stack overflow error has ocurred. Array maximum size of ${maxSize.current} exceeded.`)
            return;
        }
        const _array = new Array(size);
        for (let i = 0; i < _array.length; i++) {
            _array[i] = new Node(null, new Position(0, 0))
        }
        setArray(_array)
    }, [size])

    const write = () => {
        if (!array) return;
        if (index < 0 || index >= array.length) {
            //index out of the bound exception
        }
        console.log(array[index].ref)

    }
    // const push = () => {


    // }
    // const pop = () => {


    // }
    // const shift = () => {


    // }


    return (
        <Main className="">
            {<OperationsContainer>
                {array && array.length ? < div className="flex  items-center gap-5 justify-center">
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />
                        <Input defaultValue={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            setIndex(Number.parseInt(e.target.value))
                        }} type="number" min={0} />
                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {
                            try {
                                write()
                            } catch (error) {
                                if (error instanceof IndexOutOfBoundsError) {
                                    alert(error.message)
                                    return;
                                }
                                alert('Something went wrong')
                            }
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

                </div> : null}
                {(!array || !array.length) && <div className="flex  items-center gap-2 justify-center">
                    <Input defaultValue={size} placeholder="size" className="text-black w-20" onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        if (isNaN(value)) {
                            e.target.value = 0 + '';
                        }

                        else if (value < 0) {
                            e.target.value = 0 + '';
                        }
                        setSize(value)
                    }} type="number" min={0} />
                    <ButtonAction title="create" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={() => {
                        try {
                            create()
                        } catch (error) {
                            if (error instanceof IndexOutOfBoundsError) {
                                setError(error.message);
                                return;
                            }
                            setError('Something went wrong')
                        }
                    }} />
                </div>}


                {array && array.length ? <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={() => {
                    setArray(null)
                }} /> : null}
                {array && array.length ? <PopOverComponent content={
                    <div>

                    </div>
                } trigger={<Button variant={'ghost'}><Wrench color="white" /></Button>} /> : null}

            </OperationsContainer>}


            <div className="w-full overflow-auto flex items-center justify-start   p-4 ">



                <div className="  flex items-center justify-center">



                    {
                        [...Array(maxSize.current)].map((d, i) => {
                            const memoryAdress = '0x' + prefix0(i);
                            return (
                                <div key={'static-array-empty-' + i}>

                                    <div title={"Memory address: " + memoryAdress} className="text-sm flex items-center justify-center py-2 border border-white w-[50px] h-[15px]">
                                        <p>{memoryAdress}</p>
                                    </div>
                                    <div className=" w-[50px] h-[50px]">
                                        {array && array[i] ? <ArrayNodeComponent node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}

                                    </div>
                                    <div title={"index: " + i} style={{
                                        visibility: array && array[i] ? 'visible' : 'hidden'
                                    }} className={"text-sm flex items-center justify-center py-2 border border-white w-[50px] h-[15px]"}>
                                        <p>{i}</p>
                                    </div>
                                </div>
                            )

                        })

                    }

                </div>
            </div>
            <PopUp title="StackOverFlowError" buttonText="dismiss" handleOnPopUpButton={() => {
                setError('')
                setArray(null);
            }} open={error ? true : false} showTrigger={false} description={error} />
        </Main >
    )
}
