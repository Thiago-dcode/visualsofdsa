import { Edge } from "@/lib/classes/Edge";
import { animate } from "@/lib/animations";
import { Ref } from "@/types";


const useAnimation = () => {

    const animateEdge = async (edge: Edge,speed:number,firstCall:boolean =false) => {
        await animate(edge.ref, `lit-node-edge`,speed,() => { }, firstCall);
      }
      const focus = (ref:Ref) => {
       
        if(ref){
        ref.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
      return {
        animateEdge,
        focus
      }
     
}

export default useAnimation
