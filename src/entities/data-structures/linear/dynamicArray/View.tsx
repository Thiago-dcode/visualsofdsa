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
import { PopUp } from "@/components/ui/PopUp"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import OperationsContainer from "@/components/container/OperationsContainer"

import ButtonAction from "../_components/ButtonAction"
import { act, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Section from "@/components/container/Section"
import StaticArrayNodeComponent from "../staticArray/components/StaticArrayNodeComponent"
import Properties from "@/components/app/Properties"
import { searchResult } from "../staticArray/type"
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
    const { array, write, error, capacity, size, cleanUp, action, push, search } = useDynamicArray();
    const [open, setOpen] = useState(false);
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const [data, setData] = useState<string>('');
    const [pushData, setPushData] = useState<string>('');
    const [searchData, setSearchData] = useState<string>('');
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {

        console.log(action)

    }, [action])
    return (
        <Main className="">

            {<OperationsContainer setOpen={(value) => {

                setOpen(value)

            }} open={open}>
                {array && array.length ? < Section>

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            const n = Number.parseInt(e.target.value);
                            console.log(n)
                            setIndex(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />
                        <Input value={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="write" className='bg-green-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            await write(data === '' ? null : data, index)
                            setIsAnimationRunning(false)

                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input value={pushData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setPushData(e.target.value)
                        }} type="text" name="" id="" />
                        <ButtonAction title="push" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            await push(pushData === '' ? null : pushData)


                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input value={searchData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            setSearchData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-green-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning) return;
                            setIsAnimationRunning(true)
                            setOpen(!open)

                            await search(searchData === '' ? null : searchData, (data) => {
                                setIsAnimationRunning(false)
                                setSearchData('')
                                setSearchResult(data)
                            })


                        }} />
                    </InputWithButtonContainer>
                </Section> : null}

            </OperationsContainer>}
            <Properties properties={{
                size,
                capacity
            }} />
            <RamConteiner>
                {array &&
                    array.map((node, i) => {
                        return (
                            <MemoryAdressContainer index={i} showIndex={node !== null} key={'memoryAdressContainer-' + i}>
                                {node !== null ? <StaticArrayNodeComponent isLastNode={i === size} action={action} node={node} setAnimationRunning={setIsAnimationRunning} /> : <p className="border-2 flex items-center justify-center
                     border-white/50 w-full h-full">NULL</p>}
                            </MemoryAdressContainer>

                        )
                    })
                }

                {searchResult && <PopUp title={'Steps:'} buttonText="close" handleOnPopUpButton={() => {
                    setSearchResult(null)

                }} open={searchResult ? true : false} showTrigger={false} description={<>


                    {!searchResult.found

                        ? <p>Data <b> {searchResult.data} </b>  not found. </p> :
                        <p> Data <b> {searchResult.data} </b> found on index: <b>{searchResult.steps - 1} </b>. Steps taken:  <b> {searchResult.steps} </b>.</p>
                    }

                </>} />}
                {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                    cleanUp()
                    setIndex(0)

                }} open={error ? true : false} showTrigger={false} description={error.description} />}
            </RamConteiner>

        </Main >
    )
}
