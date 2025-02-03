'use client'
import Main from "@/components/container/Main"
import RamContainer from "@/components/container/RamContainer"
import useDynamicArray from "./hooks/useDynamicArray"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
import { PopUp } from "@/components/ui/PopUp"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Section from "@/components/container/Section"
import StaticArrayNodeComponent from "../static-array/components/StaticArrayNodeComponent"
import Properties from "@/components/app/Properties"
import { searchResult } from "../static-array/type"
import './style.css'
import Info from "@/components/ui/info"
import Link from "next/link"
import Title from "@/components/ui/Title"
import { useAnimationRunning } from "@/context/animationRunningContext"
export default function DynamicArray() {
    const { array, write, insert, fill, access, error, maxSize, capacity, size, cleanUp, delete: del, action, push, pop, search } = useDynamicArray();
    const [open, setOpen] = useState(false);
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
    const [data, setData] = useState<string>('');
    const [pushData, setPushData] = useState<string>('');
    const [searchData, setSearchData] = useState<string>('');
    const [insertData, setInsertData] = useState<string>('');
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [indexAccess, setIndexAccess] = useState<number>(0);
    const [indexInsert, setIndexInsert] = useState<number>(0);
    const [indexDelete, setIndexDelete] = useState<number>(0);
    const [fillAmount, setFillAmount] = useState(0);
    useEffect(() => {

        console.log(action)

    }, [action])
    return (
        <>
            {<OperationsContainer setOpen={(value) => {

                setOpen(value)

            }} open={open}>
                {array && array.length ? < Section >

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={index} placeholder="index" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);

                            setIndex(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />
                        <Input value={data} placeholder="data" className="text-black w-24" onChange={(e) => {
                            if (isAnimationRunning) return;
                            setData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="write" action="write" isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || index === undefined) return;
                            setAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            await write(data === '' ? null : data, index)
                            setAnimationRunning(false)

                        }} />

                    </InputWithButtonContainer>
                    {/* PUSH OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={pushData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            if (isAnimationRunning) return;
                            setPushData(e.target.value)
                        }} type="text" name="" id="" />
                        <ButtonAction title="push" action="write" isLoading={isAnimationRunning} onClick={() => {
                            if (isAnimationRunning || index === undefined) return;
                            setAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            push(pushData === '' ? null : pushData)


                        }} />

                    </InputWithButtonContainer>
                    {/* INSERT OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={indexInsert} placeholder="index" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);
                            setIndexInsert(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />
                        <Input value={insertData} placeholder="insertData" className="text-black w-24" onChange={(e) => {
                            if (isAnimationRunning) return;
                            setInsertData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="insert" action="insert" isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || indexInsert === undefined) return;
                            setAnimationRunning(true)
                            setOpen(false)
                            await insert(insertData === '' ? null : insertData, indexInsert)



                        }} />
                    </InputWithButtonContainer>
                    {/* ACCESS OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={indexAccess} placeholder="index" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);

                            setIndexAccess(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />
                        <ButtonAction title="access" action="read" isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || indexAccess === undefined) return;
                            setAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            await access(indexAccess)
                            setAnimationRunning(false)

                        }} />
                    </InputWithButtonContainer>
                    {/* SEARCH OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={searchData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            if (isAnimationRunning) return;
                            setSearchData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" action="search" isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning) return;
                            setAnimationRunning(true)
                            setOpen(!open)

                            await search(searchData === '' ? null : searchData, (data) => {
                                setAnimationRunning(false)
                                setSearchData('')
                                setSearchResult(data)
                            })


                        }} />
                    </InputWithButtonContainer>
                    {/* POP OPERATION */}
                    {!size || !array ? null :
                        <>
                            <ButtonAction title="pop" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                if (isAnimationRunning) return;
                                setAnimationRunning(true)
                                setOpen(!open)

                                await pop()
                                setAnimationRunning(false)
                            }} />
                            {/* DELETE OPERATION */}

                            <InputWithButtonContainer>
                                <Input value={indexDelete} placeholder="index" className="text-black w-20" onChange={(e) => {
                                    if (isAnimationRunning) return;
                                    const n = Number.parseInt(e.target.value);
                                    setIndexDelete(isNaN(n) ? 0 : n)
                                }} type="number" min={0} />

                                <ButtonAction title="delete" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                    if (isAnimationRunning || indexDelete === undefined) return;
                                    setAnimationRunning(true)
                                    setOpen(false)
                                    await del(indexDelete)
                                    setAnimationRunning(false)



                                }} />
                            </InputWithButtonContainer></>}
                    {/* FILL OPERATION */}
                    <InputWithButtonContainer>
                        <Input value={fillAmount} placeholder="fillAmount" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);
                            setFillAmount(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />

                        <ButtonAction title="fill" action="fill" isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || !fillAmount) return;

                            setOpen(false)
                            setAnimationRunning(true);
                            fill(fillAmount);




                        }} />
                    </InputWithButtonContainer>
                </Section> : null}

            </OperationsContainer>}
            {/* //PROPERTIES AND CONFIG: */}
            <div className="flex  justify-between w-full px-4">
                <Properties properties={{
                    size: {
                        value: size,
                    },
                    capacity: {
                        value: capacity
                    },
                    maxSize: {
                        value: maxSize
                    }
                }} />
                {/* {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={queue} />
            } trigger={<Button><Wrench color="white" /></Button>} />
          </div>} */}

            </div>

            <RamContainer>
                {array &&
                    array.map((node, i) => {
                        return (
                            <MemoryAdressContainer index={i} showIndex={node !== null} key={'memoryAdressContainer-' + `${node ? node.id : 'null-' + i}`}>
                                {node !== null ? <StaticArrayNodeComponent isLastNode={i === size - 1} action={action} node={node} setAnimationRunning={setAnimationRunning} /> : <p className="border flex items-center justify-center
                     dark:border-white/50 border-black/50 w-full h-full"></p>}
                            </MemoryAdressContainer>

                        )
                    })
                }

                {searchResult && <PopUp title={'Steps:'} buttonText="close" handleOnPopUpButton={() => {
                    setSearchResult(null)

                }} open={searchResult ? true : false} showTrigger={false} description={<>


                    {!searchResult.found

                        ? <>Data <b> {searchResult.data} </b>  not found. </> :
                        <> Data <b> {searchResult.data} </b> found on index: <b>{searchResult.steps - 1} </b>. Steps taken:  <b> {searchResult.steps} </b>.</>
                    }

                </>} />}
                {error && <PopUp title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                    cleanUp()
                    setIndex(0)
                    setAnimationRunning(false)

                }} open={error ? true : false} showTrigger={false} description={error.description} />}
            </RamContainer>

        </ >
    )
}
