import { Ref } from "@/types"
import { RefObject, useEffect, useMemo, useState } from "react"


export default function useOnScreen() {

    const [isIntersecting, setIntersecting] = useState(false)
    const [ref, setRef] = useState<Ref>(null)
  

    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    ), [ref])
  
    useEffect(() => {
        if(ref){
            observer.observe(ref)
        }

        return () => observer.disconnect()
    }, [ref,observer])
  
    return {isIntersecting,setRef}
  }
