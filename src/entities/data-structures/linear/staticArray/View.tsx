'use client'
import { useState } from "react"
import Main from "@/components/container/Main"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { Input } from "@/components/ui/input"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { prefix0 } from "@/lib/utils"
import { PopUp } from "@/components/ui/PopUp"
import StaticArrayNodeComponent from "./components/StaticArrayNodeComponent"
import useStaticArray from "./hooks/useStaticArray"
import './style.css'
import { searchResult, ArrayActions } from "./type"
import Info from "@/components/ui/info"
import Section from "@/components/container/Section"
import UseLinear from "../_hooks/UseLinear"
import { PopOverComponent } from "@/components/ui/PopOverComponent"
import { Button } from "@/components/ui/button"
import { Wrench } from "lucide-react"
import LinearDsConfig from "../_components/LinearDsConfig"
import RamConteiner from "@/components/container/RamContainer"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
import { MemorySize } from "@/types"
import Title from "@/components/ui/Title"
import Properties from "@/components/app/Properties"


export default function StaticArray() {
    const { array, create, write, access, search, error, flush, maxSize, setMaxSize } = useStaticArray();
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const [action, setAction] = useState<ArrayActions>('create')
    const [data, setData] = useState<string>('');
    const [searchData, setSearchData] = useState<string>('');
    const [size, setSize] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    const [indexAccess, setIndexAccess] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const [render, setRender] = useState(false)
    const cleanUp = () => {
        setIsAnimationRunning(false)
        flush();
        setAction('create')
        setSize(0)
        setData('')
        setIndex(0)
        setSearchResult(null)

    }
    return (
        <Main className="">
            <div className='flex items-center justify-center gap-2'>
                <Title title={'Static Array'} />

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
            {<OperationsContainer setOpen={(value) => {

                setOpen(value)



            }} open={open}>
                {array && array.length ? < Section>

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            const n = Number.parseInt(e.target.value);
                            setIndex(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />
                        <Input value={data} placeholder="data" className="text-black w-24" onChange={(e) => {

                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            setAction('write')
                            console.log(data, index)
                            await write(data === '' || data === undefined ? null : data, index, () => {


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
                            setOpen(false)
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
                            setOpen(!open)
                            setAction('search')
                            await search(searchData === '' ? null : searchData, (data) => {
                                setIsAnimationRunning(false)
                                setSearchData('')
                                setSearchResult(data)
                            })


                        }} />
                    </InputWithButtonContainer>

                </Section> : null}

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
                    <ButtonAction title="create" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                        if (isAnimationRunning || !size) return;
                        setOpen(!open)
                        setIsAnimationRunning(true)
                        await create(size)
                        setIsAnimationRunning(false)
                    }} />
                    <ButtonAction title="fill" className='bg-blue-400 hover:bg-blue-600' isLoading={isAnimationRunning} onClick={async () => {
                        if (isAnimationRunning) return;
                        setOpen(!open)
                        setIsAnimationRunning(true)
                        await create(maxSize)
                        setIsAnimationRunning(false)
                    }} />
                </div>}

                {array && array.length ? <ButtonAction title="fill" className='bg-blue-400 hover:bg-blue-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning} onClick={async () => {
                    if (isAnimationRunning) return;
                    setIsAnimationRunning(true)
                    setAction('write')
                    for (let i = 0; i < array.length; i++) {
                        const element = array[i];
                        if (!element || element.data) continue;
                        await write('data-' + i, i, () => {
                            setRender(prev => !prev)
                        }, true);

                    }
                    setIsAnimationRunning(false);

                }} /> : null}

                {array && array.length ? <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600 self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={() => {
                    flush()
                    setIsAnimationRunning(false)
                    setAction('create')
                }} /> : null}

            </OperationsContainer>}


            {/* EXTRA INFO SECTION */}
            <div className="flex  justify-between w-full px-4">

            <Properties properties={{
                        'ArraySize':{
                            value:array?.length||null
                        },
                        'memorySize':{
                            value:maxSize
                        }
                    }}/>
                {!isAnimationRunning && <div>
                   
                    <PopOverComponent content={
                        <div className='flex flex-col items-center justify-center gap-4'>
                            <div>
                                <label htmlFor="size">Memory size</label>
                                <Input defaultValue={maxSize} onChange={(e) => {
                                    setMaxSize(Number.parseInt(e.target.value))
                                    setAction('create')
                                    flush()

                                }} name='size' type='range' min={1} max={200} />
                            </div>
                        </div>

                    } trigger={<Button onClick={() => {

                    }}><Wrench color="white" /></Button>} />
                </div>}
            </div>

            <RamConteiner>

                {
                    [...Array(maxSize)].map((d, i) => {
                        return (

                            <MemoryAdressContainer size={MemorySize.L} index={i} showIndex={array && array[i] !== undefined ? true : false} key={'MemoryAdressContainer-' + i}>

                                {array && array[i] ? <StaticArrayNodeComponent isLastNode={i === array.length - 1} action={action} setAnimationRunning={setIsAnimationRunning} node={array[i]} /> : <p className="border border-white/50 w-full h-full"></p>}
                            </MemoryAdressContainer>



                        )

                    })

                }

            </RamConteiner>




            {searchResult && <PopUp title={'Steps:'} buttonText="close" handleOnPopUpButton={() => {
                setSearchResult(null)

            }} open={searchResult ? true : false} showTrigger={false} description={`${!searchResult.found ? `Data ${searchResult.data} not found.` : `Data ${searchResult.data} found on index: ${searchResult.steps - 1}.`} Steps taken: ${searchResult.steps}.`} />}

            {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                cleanUp()

            }} open={error ? true : false} showTrigger={false} description={error.description} />}
        </Main >
    )
}
