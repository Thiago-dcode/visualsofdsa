'use client'
import { useRef, useState } from "react"
import Main from "@/components/container/Main"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { Input } from "@/components/ui/input"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { Button } from "@/components/ui/button"
import { PopOverComponent } from "@/components/ui/PopOverComponent"
import { Wrench } from "lucide-react"
import { prefix0 } from "@/lib/utils"
import { PopUp } from "@/components/ui/PopUp"
import StaticArrayNodeComponent from "./components/StaticArrayNodeComponent"
import useStaticArray from "./hooks/useStaticArray"
import './style.css'


export default function StaticArray() {
    const { array, create, write, error, flush, maxSize } = useStaticArray();
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const [_render, setRender] = useState(false)
    // const setIsAnimationRunning = (value: boolean) => {
    //     isAnimationRunning = value;
    // }
    const [action, setAction] = useState<'create' | 'write'>('create')
    const [data, setData] = useState<string>('');
    const [size, setSize] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    return (
        <Main className="">
            {<OperationsContainer>
                {array && array.length ? < div className="flex  items-center gap-5 justify-center">

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />
                        <Input defaultValue={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            setIndex(Number.parseInt(e.target.value))
                        }} type="number" min={0} />
                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;

                            setIsAnimationRunning(true)
                            console.log(data)
                            await write(data === ''?null:data, index, () => {
                                setAction('write')
                            })
                            setIsAnimationRunning(false)

                        }} />
                    </InputWithButtonContainer>
                    {/* ACCESS OPERATION */}
                    <InputWithButtonContainer>
                        <Input placeholder="data" className="text-black w-24" onChange={(e) => {

                        }} type="text" name="" id="" />

                        <ButtonAction title="access" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning} onClick={() => {
                            if (isAnimationRunning) return;


                        }} />
                    </InputWithButtonContainer>
                    {/* SEARCH OPERATION */}
                    <InputWithButtonContainer>
                        <Input placeholder="data" className="text-black w-24" onChange={(e) => {

                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {
                            if (isAnimationRunning) return;


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
                    <ButtonAction title="create" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {
                        if (isAnimationRunning || !size) return;
                        setIsAnimationRunning(true)
                        create(size)
                        setIsAnimationRunning(false)
                    }} />
                </div>}


                {array && array.length ? <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={() => {
                    flush()
                    setIsAnimationRunning(false)
                    setAction('create')
                }} /> : null}
                {array && array.length ? <PopOverComponent content={
                    <div>

                    </div>
                } trigger={<Button variant={'ghost'}><Wrench color="white" /></Button>} /> : null}

            </OperationsContainer>}


            <div className="md:w-full flex items-center justify-center">



                <div className="w-full  flex-wrap gap-y-4 flex items-center justify-start">


                    {
                        [...Array(maxSize)].map((d, i) => {
                            const memoryAdress = '0x' + prefix0(i);
                            return (
                                <div key={'static-array-empty-' + i}>
                                    <div title={"Memory address: " + memoryAdress} className="text-sm flex items-center justify-center py-2 border border-white w-[50px] h-[15px]">
                                        <p>{memoryAdress}</p>
                                    </div>
                                    <div className=" w-[50px] h-[50px]">
                                        {array && array[i] ? <StaticArrayNodeComponent action={action} setAnimationRunning={setIsAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}

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
            {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                setIsAnimationRunning(false)
                flush();
                setAction('create')
                setSize(0)
                setData('')
                setIndex(0)

            }} open={error ? true : false} showTrigger={false} description={error.description} />}
        </Main >
    )
}
