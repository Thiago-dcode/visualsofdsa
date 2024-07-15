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
import { staticArrayAction } from "./type"
import Info from "@/components/ui/info"


export default function StaticArray() {
    const { array, create, write, access, search, error, flush, maxSize } = useStaticArray();
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const [action, setAction] = useState<staticArrayAction>('create')
    const [data, setData] = useState<string>('');
    const [searchData, setSearchData] = useState<string>('');
    const [size, setSize] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    const [indexAccess, setIndexAccess] = useState<number>(0);
    return (
        <Main className="">

            
            {<OperationsContainer>
                {array && array.length ? < div className="flex  items-center gap-5 justify-center">

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            setIndex(Number.parseInt(e.target.value))
                        }} type="number" min={0} />
                        <Input value={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;

                            setIsAnimationRunning(true)
                            await write(data === '' ? null : data, index, () => {
                                setAction('write')
                            })
                            setIsAnimationRunning(false)

                        }} />
                    </InputWithButtonContainer>
                    {/* ACCESS OPERATION */}
                    <InputWithButtonContainer>
                        <Input defaultValue={indexAccess} placeholder="index" className="text-black w-20" onChange={(e) => {
                            setIndexAccess(Number.parseInt(e.target.value))
                        }} type="number" min={0} />
                        <ButtonAction title="access" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning) return;
                            setIsAnimationRunning(true);
                            setAction('access')
                            await access(indexAccess, () => {
                                setIsAnimationRunning(false)
                            })

                        }} />
                    </InputWithButtonContainer>
                    {/* SEARCH OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={searchData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setSearchData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning) return;
                            setIsAnimationRunning(true)
                            setAction('search')
                            await search(searchData === '' ? null : searchData, () => {
                                setIsAnimationRunning(false)
                                setSearchData('')
                            })


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

            </OperationsContainer>}


            {/* EXTRA INFO SECTION */}
            <div className="flex  justify-between w-full px-4">
                <Info title="Static Array" text={<article>
                    <p> A static array is <b>a linear data structure</b> that has a <b>fixed size</b> determined at the time of creation(compiler time). This means that the number of elements in the array is set and cannot be changed dynamically. Static arrays are commonly used in various algorithms and applications where the size of the data set is known in advance, such as storing a collection of items, implementing lookup tables, and representing matrices.</p>
                    <br />
                    <h4 className="font-semibold py-2"> Key Operations of a Static Array:</h4>

                    <ul>
                        <li>
                            <b className="font-semibold text-green-400"> Write: </b> This operation <b>sets the value of an element at a specified index</b>. Since the array size is fixed, writing a value to an existing position is straightforward and efficient. <br /><b>Time complexity: O(1).</b>
                        </li>
                        <br />
                        <li>
                            <b className="font-semibold text-yellow-400"> Access: </b>This operation <b>retrieves an element at a specified index</b>. Since arrays provide direct access to any element via its index, accessing an element is very efficient. <br /><b>Time complexity: O(1).</b>
                        </li>
                        <br />

                        <li>
                            <b className="font-semibold text-purple-400"> Search: </b> This operation is the most complex and time-consuming because the program must start from the beginning of the array, checking each memory address until the desired value is found or the end of the array is reached. This is because, by default, the program does not know which index stores the value, so it must consider the worst-case scenario. <br /><b>Time complexity: O(n).</b>
                        </li>
                    </ul>
                </article>
                } className="self-start" />


            </div>
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
