'use client'
import Main from "@/components/container/Main"
import RamConteiner from "@/components/container/RamConteiner"
import useDynamicArray from "./hooks/useDynamicArray"
import MemoryAdressContainer from "../_components/MemoryAdressContainer"
import { PopUp } from "@/components/ui/PopUp"
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer"
import OperationsContainer from "@/components/container/OperationsContainer"
import ButtonAction from "../_components/ButtonAction"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import Section from "@/components/container/Section"
import StaticArrayNodeComponent from "../staticArray/components/StaticArrayNodeComponent"
import Properties from "@/components/app/Properties"
import { searchResult } from "../staticArray/type"
import './style.css'
import Info from "@/components/ui/info"
import Link from "next/link"
export default function DynamicArray() {
    const { array, write, insert, fill, error, maxSize, capacity, size, cleanUp, delete: del, action, push, pop, search } = useDynamicArray();
    const [open, setOpen] = useState(false);
    const [isAnimationRunning, setIsAnimationRunning] = useState(false)
    const [data, setData] = useState<string>('');
    const [pushData, setPushData] = useState<string>('');
    const [searchData, setSearchData] = useState<string>('');
    const [insertData, setInsertData] = useState<string>('');
    const [searchResult, setSearchResult] = useState<searchResult | null>(null);
    const [index, setIndex] = useState<number>(0);
    const [indexInsert, setIndexInsert] = useState<number>(0);
    const [indexDelete, setIndexDelete] = useState<number>(0);
    const [fillAmount, setFillAmount] = useState(0);
    useEffect(() => {

        console.log(action)

    }, [action])
    return (
        <Main className="">

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
                            if (isAnimationRunning) return;
                            setPushData(e.target.value)
                        }} type="text" name="" id="" />
                        <ButtonAction title="push" className='bg-yellow-400 hover:bg-yellow-600' isLoading={isAnimationRunning} onClick={() => {
                            if (isAnimationRunning || index === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            // setAction('write')
                            push(pushData === '' ? null : pushData)


                        }} />
                    </InputWithButtonContainer>
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

                        <ButtonAction title="insert" className='bg-orange-400 hover:bg-orange-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || indexInsert === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            await insert(insertData === '' ? null : insertData, indexInsert)



                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input value={searchData} placeholder="data" className="text-black w-24" onChange={(e) => {
                            if (isAnimationRunning) return;
                            setSearchData(e.target.value)
                        }} type="text" name="" id="" />

                        <ButtonAction title="search" className='bg-blue-400 hover:bg-blue-600' isLoading={isAnimationRunning} onClick={async () => {
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
                    <ButtonAction title="pop" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={async () => {
                        if (isAnimationRunning) return;
                        setIsAnimationRunning(true)
                        setOpen(!open)

                        await pop()
                        setIsAnimationRunning(false)
                    }} />
                    <InputWithButtonContainer>
                        <Input value={indexDelete} placeholder="index" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);
                            setIndexDelete(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />

                        <ButtonAction title="delete" className='bg-red-400 hover:bg-red-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || indexDelete === undefined) return;
                            setIsAnimationRunning(true)
                            setOpen(false)
                            await del(indexDelete)
                            setIsAnimationRunning(false)



                        }} />
                    </InputWithButtonContainer>
                    <InputWithButtonContainer>
                        <Input value={fillAmount} placeholder="fillAmount" className="text-black w-20" onChange={(e) => {
                            if (isAnimationRunning) return;
                            const n = Number.parseInt(e.target.value);
                            setFillAmount(isNaN(n) ? 0 : n)
                        }} type="number" min={0} />

                        <ButtonAction title="fill" className='bg-lime-400 hover:bg-lime-600' isLoading={isAnimationRunning} onClick={async () => {
                            if (isAnimationRunning || fillAmount === undefined) return;

                            setOpen(false)
                            setIsAnimationRunning(true);
                            fill(fillAmount);




                        }} />
                    </InputWithButtonContainer>
                </Section> : null}

            </OperationsContainer>}
              {/* //EXTRA INFO AND CONFIG: */}
        <div className="flex  justify-between w-full px-4">
          <Info title="DYNAMIC ARRAY" text={<article>
            <p> A Dynamic array is <b>a linear data structure</b> similiar to <Link href={'data-structures/linear/static-array'}>static arrays</Link> but it can growth in size dynamically, in other words the array size isnt static.</p>
            <br />
            <p>Dynamic arrays share the same operations with  <Link href={'data-structures/linear/static-array'}>static arrays</Link>, but it has its own operations</p>
            <h4 className="font-semibold py-2">Key Operations of a Dynamic array:</h4>
            <ul>
              <li>
                <b className="font-semibold text-green-400"> Insert: </b>This operation <b>adds a element in a specific position by a given index</b>.To acomplish this operations, first all elements on the right side of the disired position, must be shifted to the right before the new element is inserted, and them write the new element in the position realized<br /><b>Time complexity: O(n).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-red-400"> Dequeue: </b>This operation <b>removes and returns the front element of the queue</b>. Since the queue follows the FIFO principle, the element that was first added is the one that is removed. If the queue is empty, attempting to dequeue an element will usually result in an error or an undefined value. <br /><b>Time complexity: O(1).</b>
              </li>
              <br />
              <li>
                <b className="font-semibold text-yellow-400"> Front: </b> This operation <b>returns the front element of the queue without removing it</b>. It allows you to inspect the element at the front of the queue without modifying the queue&lsquo;s state. This is useful when you need to see what the front element is without altering the queue. <br /><b>Time complexity: O(1).</b>
              </li>
            </ul>
          </article>
          } className="self-start" />
          {/* {!isStackOverFlow && !isFilling && !isAnimationRunning && <div>
            <PopOverComponent content={
              <LinearDsConfig render={render} stack={queue} />
            } trigger={<Button><Wrench color="white" /></Button>} />
          </div>} */}

        </div>
            <Properties properties={{
                size,
                capacity,
                maxSize
            }} />
            <RamConteiner>
                {array &&
                    array.map((node, i) => {
                        return (
                            <MemoryAdressContainer index={i} showIndex={node !== null} key={'memoryAdressContainer-' + `${node ? node.id : 'null-' + i}`}>
                                {node !== null ? <StaticArrayNodeComponent isLastNode={i === size - 1} action={action} node={node} setAnimationRunning={setIsAnimationRunning} /> : <p className="border-2 flex items-center justify-center
                     border-white/50 w-full h-full">NULL</p>}
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
                    setIsAnimationRunning(false)

                }} open={error ? true : false} showTrigger={false} description={error.description} />}
            </RamConteiner>

        </Main >
    )
}
