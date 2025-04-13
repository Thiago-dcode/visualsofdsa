import { Edge } from "@/lib/classes/Edge";
import { animate } from "@/lib/animations";
import { Ref } from "@/types";
import { useCallback } from "react"; 

const useAnimation = () => {

      const animateEdge = useCallback(async (edge: Edge,speed:number,firstCall:boolean =false) => {
        await animate(edge.ref, `lit-node-edge`,speed,{
          onlyOnce: firstCall,
        });
      },[])
      const focus = useCallback((ref:Ref) => {
       
        if(ref){
        ref.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      },[])

      const setProperty = useCallback((ref:Ref,property:string,value:string) => {
        if(ref){
            ref.style.setProperty(`--${property}`,value);
        }
      },[]) 
      return {
        animateEdge,
        focus,
        setProperty
      }
     
}


export default useAnimation
