'use client'
import { useState, useRef, useCallback } from "react"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { Input } from "@/components/ui/input"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import { PopUp } from "@/components/ui/PopUp"
import StaticArrayNodeComponent from "./components/StaticArrayNodeComponent"
import useStaticArray from "./hooks/useStaticArray"
import { searchResult } from "./type"
import Section from "@/components/container/Section"
import RamConteiner from "@/components/container/RamContainer"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
import { MemorySize } from "@/types"
import Properties from "@/components/app/Properties"
import { useAnimationRunning } from "@/context/animationRunningContext"
import SpeedComponent from "@/components/app/speedComponent"
import { toast } from "sonner"
import { delay } from "@/lib/utils"
import ConfigComponent from "@/components/app/ConfigComponent"
import { useToast } from "@/hooks/useToast"
export default function StaticArray() {

    const { array, create, write, access, search, error, flush, maxSize, setMaxSize, handleSetSpeed, speed } = useStaticArray(50);
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning()
    const { toastInfo } = useToast();
    const refWrite = useRef<HTMLInputElement>(null);
    const refWriteData = useRef<HTMLInputElement>(null);
    const refAccess = useRef<HTMLInputElement>(null);
    const refSearch = useRef<HTMLInputElement>(null);
    const refSize = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const handleToastInfo = useCallback((action: string) => {
        toastInfo(`You must select a valid index for ${action.toUpperCase()} operation`)
    }, [toastInfo])
    const handleWrite = useCallback(async () => {
        if (isAnimationRunning || !refWriteData.current || !refWrite.current) return;
        setAnimationRunning(true)
        const data = refWriteData.current.value;
        const index = Number.parseInt(refWrite.current.value);
        if (!isNaN(index)) await write(data === '' || data === undefined ? null : data, index)
        else handleToastInfo('write')
        refWriteData.current.value = ''
        refWrite.current.value = ''
        setAnimationRunning(false)
    }, [isAnimationRunning])

    const handleAccess = useCallback(async () => {
        if (isAnimationRunning || !refAccess.current) return;
        setAnimationRunning(true);
        setOpen(false)
        const index = Number.parseInt(refAccess.current.value);
        if (!isNaN(index)) await access(index)
        else handleToastInfo('access')


        refAccess.current.value = ''
        setAnimationRunning(false)
    }, [isAnimationRunning])

    const handleSearch = useCallback(async () => {
        if (isAnimationRunning || !refSearch.current) return;
        setAnimationRunning(true)
        setOpen(!open)
        const result = await search(refSearch.current.value === '' ? null : refSearch.current.value)
        setSearchResult(result)
        refSearch.current.value = ''
        setAnimationRunning(false)
    }, [isAnimationRunning])

    const handleCreate = useCallback(async () => {
        if (isAnimationRunning || !refSize.current) return;

        setOpen(!open)
        const size = Number.parseInt(refSize.current.value)

        setAnimationRunning(true)
        if (!isNaN(size) && size > 0) await create(size)
        refSize.current.value = ''
        setAnimationRunning(false)
    }, [isAnimationRunning])

    const handleFill = useCallback(async () => {
        if (isAnimationRunning || !array) return;
        setAnimationRunning(true)
        const toastId = toast.loading('Filling array');
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (!element || element.data) continue;
            await write('data-' + i, i, true);

        }
        await delay(200);
        toast.dismiss(toastId)
        setAnimationRunning(false);
    }, [array, isAnimationRunning])
    const cleanUp = useCallback(() => {
        setAnimationRunning(false)
        flush();
        setSearchResult(null)
        if (refSize.current) refSize.current.value = ''
        if (refWriteData.current) refWriteData.current.value = ''
        if (refWrite.current) refWrite.current.value = ''
        if (refAccess.current) refAccess.current.value = ''
        if (refSearch.current) refSearch.current.value = ''
    }, [])

    return (
        <>
            {<OperationsContainer setOpen={(value) => {
                setOpen(value)
            }} open={open}>
                {array && array.length ? < Section>

                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refWrite} placeholder="index" className="text-black w-20" type="number" min={0} />
                        <Input ref={refWriteData} placeholder="data" className="text-black w-24" type="text" name="" id="" />

                        <ButtonAction title="write" action="write" isLoading={isAnimationRunning} onClick={async () => {

                            await handleWrite()
                        }} />
                    </InputWithButtonContainer>
                    {/* ACCESS OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refAccess} placeholder="index" className="text-black w-20" type="number" min={0} />
                        <ButtonAction title="access" action="read" isLoading={isAnimationRunning} onClick={async () => {

                            await handleAccess()

                        }} />
                    </InputWithButtonContainer>
                    {/* SEARCH OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refSearch} placeholder="data" className="text-black w-24" type="text" name="" id="" />

                        <ButtonAction title="search" action="search" isLoading={isAnimationRunning} onClick={async () => {

                            await handleSearch()

                        }} />
                    </InputWithButtonContainer>

                </Section> : null}

                {(!array || !array.length) && <div className="flex  items-center gap-2 justify-center">
                    <Input ref={refSize} placeholder="size" className="text-black w-20" type="number" min={0} />
                    <ButtonAction title="create" action="write" isLoading={isAnimationRunning} onClick={async () => {
                        await handleCreate()
                    }} />
                    <ButtonAction title="fill" action="fill" isLoading={isAnimationRunning} onClick={async () => {
                        if (isAnimationRunning) return;
                        setOpen(!open)
                        setAnimationRunning(true)
                        await create(maxSize)
                        setAnimationRunning(false)
                    }} />
                </div>}

                {array && array.length ? <ButtonAction title="fill" action="fill" className='self-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={isAnimationRunning} onClick={async () => {

                    await handleFill()

                }} /> : null}

                {array && array.length ? <ButtonAction title="delete" action="delete" className='elf-end desktop:mt-0 tablet:mt-0 mt-5' isLoading={false} onClick={() => {
                    flush()
                    setAnimationRunning(false)
                }} /> : null}

            </OperationsContainer>}


            {/* EXTRA INFO SECTION */}
            <div className="flex  justify-between w-full px-4">

                <Properties properties={{
                    'ArraySize': {
                        value: array !== null ? array.length : 'null'
                    },
                    'memorySize': {
                        value: maxSize
                    }
                }} />


                <ConfigComponent available={!isAnimationRunning}>
                    <div>
                        <label htmlFor="size">Memory size</label>
                        <Input defaultValue={maxSize} onChange={(e) => {
                            setMaxSize(Number.parseInt(e.target.value))
                            flush()

                        }} name='size' type='range' min={1} max={200} />
                    </div>
                    <SpeedComponent speed={speed} setSpeed={handleSetSpeed} />

                </ConfigComponent>
            </div>

            <RamConteiner>

                {
                    [...Array(maxSize)].map((d, i) => {
                        return (

                            <MemoryAdressContainer memory={array && array[i] !== undefined ? array[i] : null} size={MemorySize.L} index={i} showIndex={array && array[i] !== undefined ? true : false} key={'MemoryAdressContainer-' + i}>

                                {array && array[i] ? <StaticArrayNodeComponent isLastNode={i === array.length - 1} setAnimationRunning={setAnimationRunning} node={array[i]} /> : <p className="border dark:border-white/50 border-black/50 w-full h-full"></p>}
                            </MemoryAdressContainer>



                        )

                    })

                }

            </RamConteiner>




            {searchResult && <PopUp className="z-[102]" title={'Steps:'} buttonText="close" handleOnPopUpButton={() => {
                setSearchResult(null)

            }} open={searchResult ? true : false} showTrigger={false} description={`${!searchResult.found ? `Data ${searchResult.data} not found.` : `Data ${searchResult.data} found on index: ${searchResult.steps - 1}.`} Steps taken: ${searchResult.steps}.`} />}

            {error && <PopUp className="z-[102]" title={error.name} buttonText="dismiss" handleOnPopUpButton={() => {
                cleanUp()

            }} open={error ? true : false} showTrigger={false} description={error.description} />}
        </>
    )
}
