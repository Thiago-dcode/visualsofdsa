'use client'
import { useEffect, useRef, useState } from "react"
import Main from "@/components/container/Main"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { Input } from "@/components/ui/input"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { Button } from "@/components/ui/button"
import { PopOverComponent } from "@/components/ui/PopOverComponent"
import { Wrench } from "lucide-react"
import { prefix0 } from "@/lib/utils"
import IndexOutOfBoundsError from "@/lib/errors/IndexOutOfTheBondError"
import { PopUp } from "@/components/ui/PopUp"
import ArrayNodeComponent from "./components/ArrayNodeComponent"
import useStaticArray from "./hooks/useStaticArray"
import './style.css'


export default function StaticArray() {
    const { array, create, write, error, flush } = useStaticArray();
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const maxSize = useRef(30);
    const [data, setData] = useState<string>('');
    const [size, setSize] = useState<number | null>(null)
    const [index, setIndex] = useState<number | null>(null);



    useEffect(() => {

        console.log('IS ANIMATION RUNNG', isAnimationRunning)
    }, [isAnimationRunning])


    return (
        <Main className="">
            {<OperationsContainer>
                {array && array.length ? < div className="flex  items-center gap-5 justify-center">
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />
                        <Input value={index === null ? '' : index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            setIndex(Number.parseInt(e.target.value))
                        }} type="number" min={0} />
                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (!index || isAnimationRunning) return;
                            await write(data ? data : null, index)
                            setData('')
                            setIndex(null);

                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input defaultValue={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={() => {
                            if (isAnimationRunning) return;


                        }} />
                    </InputWithButtonContainer>

                </div> : null}
                {(!array || !array.length) && <div className="flex  items-center gap-2 justify-center">
                    <Input value={size ? size : ''} placeholder="size" className="text-black w-20" onChange={(e) => {
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
                    }} />
                </div>}


                {array && array.length ? <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={() => {
                    flush()
                    setIsAnimationRunning(false)
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
                                        {array && array[i] ? <ArrayNodeComponent setAnimationRunning={setIsAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}

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
                setSize(null)

            }} open={error ? true : false} showTrigger={false} description={error.description} />}
        </Main >
    )
}
