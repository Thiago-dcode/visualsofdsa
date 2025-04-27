'use client'
import RamContainer from "@/components/container/RamContainer"
import useDynamicArray from "./hooks/useDynamicArray"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
import { PopUp } from "@/components/ui/PopUp"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { useCallback, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import Section from "@/components/container/Section"
import StaticArrayNodeComponent from "../static-array/components/StaticArrayNodeComponent"
import Properties from "@/components/app/Properties"
import { searchResult } from "../static-array/type"
import { useAnimationRunning } from "@/context/animationRunningContext"
import { useToast } from "@/hooks/useToast"
import SpeedComponent from "@/components/app/speedComponent"
import ConfigComponent from "@/components/app/ConfigComponent"
import useResponsive from "@/hooks/useResponsive"
import { MemorySize } from "@/types"
import { clearRefs } from "@/lib/utils"
export default function DynamicArray() {
    const { toastInfo } = useToast();
    const { array, write, insert, fill, access, error, maxSize, capacity, size, cleanUp, delete: del, push, pop, search, speed, handleSetSpeed } = useDynamicArray();
    const [open, setOpen] = useState(false);
    const device = useResponsive()
    const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const refWriteIndex = useRef<HTMLInputElement>(null);
    const refWriteData = useRef<HTMLInputElement>(null);
    const refPushData = useRef<HTMLInputElement>(null);
    const refInsertData = useRef<HTMLInputElement>(null);
    const refSearchData = useRef<HTMLInputElement>(null);
    const refIndexAccess = useRef<HTMLInputElement>(null);
    const refIndexInsert = useRef<HTMLInputElement>(null);
    const refIndexDelete = useRef<HTMLInputElement>(null);
    const refFillAmount = useRef<HTMLInputElement>(null);



    const initAction = useCallback(() => {
        if (!array) return false;
        setAnimationRunning(true)
        setOpen(false)
        return true;
    }, [array])

    const handleToastInfo = useCallback((action: string) => {
        toastInfo(`You must select a valid index for ${action.toUpperCase()} operation`)
    }, [toastInfo])
    const handleWrite = useCallback(async () => {
        if (isAnimationRunning || !refWriteIndex.current || !refWriteData.current || !initAction()) return;
        const index = Number.parseInt(refWriteIndex.current.value);
        const data = refWriteData.current.value;
        if (!isNaN(index)) await write(data, index)
        else handleToastInfo('write')
        setAnimationRunning(false)
        clearRefs(refWriteIndex.current, refWriteData.current)
    }, [isAnimationRunning, initAction])

    const handlePush = useCallback(async () => {
        if (isAnimationRunning || !refPushData.current || !initAction()) return;
        const data = refPushData.current.value;
        if (!push(data === '' ? null : data)) {
            setAnimationRunning(false)
        }
        clearRefs(refPushData.current)
    }, [isAnimationRunning, initAction])

    const handleInsert = useCallback(async () => {
        if (isAnimationRunning || !refIndexInsert.current || !refInsertData.current || !initAction()) return;
        const index = Number.parseInt(refIndexInsert.current.value);
        const data = refInsertData.current.value || null;
        if (isNaN(index)) {
            handleToastInfo('insert')
            setAnimationRunning(false)
            return;
        }
        const result = await insert(data, index)
        if (!result) {
            setAnimationRunning(false)
        }
        clearRefs(refIndexInsert.current, refInsertData.current)
    }, [isAnimationRunning, initAction])

    const handleAccess = useCallback(async () => {
        if (isAnimationRunning || !refIndexAccess.current || !initAction()) return;
        const index = Number.parseInt(refIndexAccess.current.value);
        if (!isNaN(index)) await access(index)
        else handleToastInfo('access')
        clearRefs(refIndexAccess.current)
        setAnimationRunning(false)
    }, [isAnimationRunning, initAction])

    const handleSearch = useCallback(async () => {
        if (isAnimationRunning || !refSearchData.current || !initAction()) return;
        const data = refSearchData.current.value || null;
        await search(data)
        setAnimationRunning(false)
        clearRefs(refSearchData.current)
    }, [isAnimationRunning, initAction])

    const handleDelete = useCallback(async () => {
        if (isAnimationRunning || !refIndexDelete.current || !initAction()) return;

        const index = Number.parseInt(refIndexDelete.current.value);
        if (!isNaN(index)) await del(index)
        clearRefs(refIndexDelete.current)
        setAnimationRunning(false)
    }, [isAnimationRunning, initAction])

    const handleFill = useCallback(async () => {
        if (isAnimationRunning || !refFillAmount.current || !initAction()) return;
        const amount = Number.parseInt(refFillAmount.current.value);
        if (isNaN(amount)) {
            handleToastInfo('fill')
            setAnimationRunning(false)
            return;
        }
        const result = await fill(amount)
        if (!result) {
            setAnimationRunning(false)
        }
        clearRefs(refFillAmount.current)
    }, [isAnimationRunning, initAction])

    const makeResponsive = useMemo(() => device.twResponsive.desktop, [device])
    return (
        <>
            {/* OPERATIONS CONTAINER WIDTH HIGHER THAN DESKTOP */}
            {!makeResponsive && <OperationsContainer makeResponsive={makeResponsive} setOpen={(value) => {
                setOpen(value)
            }} open={open}>
                {array && array.length ? <Section>
                    {/* WRITE OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refWriteIndex} placeholder="index" className="text-black w-20" type="number" min={0} />
                        <Input ref={refWriteData} placeholder="data" className="text-black w-24" type="text" name="" id="" />
                        <ButtonAction title="write" action="write" isLoading={isAnimationRunning} onClick={async () => {
                            await handleWrite()
                        }} />
                    </InputWithButtonContainer>

                    {/* PUSH OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refPushData} placeholder="data" className="text-black w-24" type="text" name="" id="" />
                        <ButtonAction title="push" action="write" isLoading={isAnimationRunning} onClick={async () => {
                            await handlePush()
                        }} />
                    </InputWithButtonContainer>

                    {/* INSERT OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refIndexInsert} placeholder="index" className="text-black w-20" type="number" min={0} />
                        <Input ref={refInsertData} placeholder="insertData" className="text-black w-24" type="text" name="" id="" />
                        <ButtonAction title="insert" action="insert" isLoading={isAnimationRunning} onClick={async () => {
                            await handleInsert()
                        }} />
                    </InputWithButtonContainer>

                    {/* ACCESS OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refIndexAccess} placeholder="index" className="text-black w-20" type="number" min={0} />
                        <ButtonAction title="access" action="read" isLoading={isAnimationRunning} onClick={async () => {
                            await handleAccess()
                        }} />
                    </InputWithButtonContainer>

                    {/* SEARCH OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refSearchData} placeholder="data" className="text-black w-24" type="text" name="" id="" />
                        <ButtonAction title="search" action="search" isLoading={isAnimationRunning} onClick={async () => {
                            await handleSearch()
                        }} />
                    </InputWithButtonContainer>

                    {/* FILL OPERATION */}
                    <InputWithButtonContainer>
                        <Input ref={refFillAmount} placeholder="fillAmount" className="text-black w-20" type="number" min={0} />
                        <ButtonAction title="fill" action="fill" isLoading={isAnimationRunning} onClick={async () => {
                            await handleFill()
                        }} />
                    </InputWithButtonContainer>

                    {/* DELETE OPERATIONS */}
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
                                <Input ref={refIndexDelete} placeholder="index" className="text-black w-20" type="number" min={0} />
                                <ButtonAction title="delete" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                    await handleDelete()
                                }} />
                            </InputWithButtonContainer>

                            <ButtonAction title="reset" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                if (isAnimationRunning) return;
                                setAnimationRunning(true)
                                setOpen(!open)
                                cleanUp()
                                setAnimationRunning(false)
                            }} />
                        </>
                    }
                </Section> : null}
            </OperationsContainer>}

            {/* PROPERTIES AND CONFIG: */}
            <div className="flex justify-between w-full px-4">
                <Properties className={makeResponsive ? 'hidden tablet:hidden desktop:flex' : ''} classNameMobile={makeResponsive ? '  tablet:block desktop:hidden' : ''} properties={{
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
                {/* OPERATIONS CONTAINER WIDTH LOWER THAN DESKTOP */}
                {makeResponsive && <OperationsContainer makeResponsive={makeResponsive} setOpen={(value) => {
                    setOpen(value)
                }} open={open}>
                    {array && array.length ? <Section makeResponsive={makeResponsive}>
                        {/* WRITE OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refWriteIndex} placeholder="index" className="text-black  max-w-24" type="number" min={0} />
                            <Input ref={refWriteData} placeholder="data" className="text-black max-w-24" type="text" name="" id="" />
                            <ButtonAction title="write" action="write" isLoading={isAnimationRunning} onClick={async () => {
                                await handleWrite()
                            }} />
                        </InputWithButtonContainer>

                        {/* PUSH OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refPushData} placeholder="data" className="text-black max-w-24" type="text" name="" id="" />
                            <ButtonAction title="push" action="write" isLoading={isAnimationRunning} onClick={async () => {
                                await handlePush()
                            }} />
                        </InputWithButtonContainer>

                        {/* INSERT OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refIndexInsert} placeholder="index" className="text-black max-w-24" type="number" min={0} />
                            <Input ref={refInsertData} placeholder="insertData" className="text-black max-w-24" type="text" name="" id="" />
                            <ButtonAction title="insert" action="insert" isLoading={isAnimationRunning} onClick={async () => {
                                await handleInsert()
                            }} />
                        </InputWithButtonContainer>

                        {/* ACCESS OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refIndexAccess} placeholder="index" className="text-black max-w-24" type="number" min={0} />
                            <ButtonAction title="access" action="read" isLoading={isAnimationRunning} onClick={async () => {
                                await handleAccess()
                            }} />
                        </InputWithButtonContainer>

                        {/* SEARCH OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refSearchData} placeholder="data" className="text-black max-w-24" type="text" name="" id="" />
                            <ButtonAction title="search" action="search" isLoading={isAnimationRunning} onClick={async () => {
                                await handleSearch()
                            }} />
                        </InputWithButtonContainer>

                        {/* FILL OPERATION */}
                        <InputWithButtonContainer makeResponsive={makeResponsive}>
                            <Input ref={refFillAmount} placeholder="fillAmount" className="text-black max-w-24" type="number" min={0} />
                            <ButtonAction title="fill" action="fill" isLoading={isAnimationRunning} onClick={async () => {
                                await handleFill()
                            }} />
                        </InputWithButtonContainer>

                        {/* DELETE OPERATIONS */}
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
                                <InputWithButtonContainer makeResponsive={makeResponsive}>
                                    <Input ref={refIndexDelete} placeholder="index" className="text-black max-w-25" type="number" min={0} />
                                    <ButtonAction title="delete" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                        await handleDelete()
                                    }} />
                                </InputWithButtonContainer>

                                <ButtonAction title="reset" action="delete" isLoading={isAnimationRunning} onClick={async () => {
                                    if (isAnimationRunning) return;
                                    setAnimationRunning(true)
                                    setOpen(!open)
                                    cleanUp()
                                    setAnimationRunning(false)
                                }} />
                            </>
                        }
                    </Section> : null}
                </OperationsContainer>}
                <ConfigComponent available={!isAnimationRunning}>

                    <SpeedComponent speed={speed} setSpeed={handleSetSpeed} />

                </ConfigComponent>
            </div>

            <RamContainer>
                {array &&
                    array.map((node, i) => {
                        return (
                            <MemoryAdressContainer size={device.twResponsive.tablet ? MemorySize.M : MemorySize.L} memory={node} index={i} showIndex={node !== null} key={'memoryAdressContainer-' + `${node ? node.id : 'null-' + i}`}>
                                {node !== null ?
                                    <StaticArrayNodeComponent node={node} setAnimationRunning={setAnimationRunning} /> :
                                    <p className="border flex items-center justify-center dark:border-white/50 border-black/50 w-full h-full"></p>
                                }
                            </MemoryAdressContainer>
                        )
                    })
                }

                {searchResult &&
                    <PopUp
                        title={'Steps:'}
                        buttonText="close"
                        handleOnPopUpButton={() => {
                            setSearchResult(null)
                        }}
                        open={searchResult ? true : false}
                        showTrigger={false}
                        description={
                            <>
                                {!searchResult.found ?
                                    <>Data <b>{searchResult.data}</b> not found.</> :
                                    <>Data <b>{searchResult.data}</b> found on index: <b>{searchResult.steps - 1}</b>. Steps taken: <b>{searchResult.steps}</b>.</>
                                }
                            </>
                        }
                    />
                }

                {error &&
                    <PopUp
                        title={error.name}
                        buttonText="dismiss"
                        handleOnPopUpButton={() => {
                            cleanUp()
                            setAnimationRunning(false)
                        }}
                        open={error ? true : false}
                        showTrigger={false}
                        description={error.description}
                    />
                }
            </RamContainer>
        </>
    )
}
