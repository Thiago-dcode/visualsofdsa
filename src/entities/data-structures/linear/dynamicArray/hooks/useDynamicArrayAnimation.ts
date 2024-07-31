import { Primitive } from "@/types";
import { requestAnimation } from "../../../../../lib/utils";
import Node from "../../_classes/Node";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
const useDynamicArrayAnimation = () => {
  const insertAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    index:number,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef =node.ref.parentElement?.parentElement?.children[2] as HTMLElement
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          resolve(true);
          ref.style.left = DynamicArrayNode.nodeSize + 'px'
          if(indexRef){
              indexRef.style.left = DynamicArrayNode.nodeSize + 'px'
          }
          ref.removeEventListener("animationend", animationEvent);
        };

        // ref.style.setProperty("--start", `${ref.offsetLeft}px`);
        // console.log("getBoundingClientRect()",ref.getBoundingClientRect())
        console.log("parent-"+index,ref.parentElement?.parentElement?.parentElement?.children[index+1])
        if(indexRef){
      
          indexRef.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);
          requestAnimation(indexRef, `insert-node ${"0.8s"}`, animationEvent);
        }
        ref.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);
        
        requestAnimation(ref, `insert-node ${"0.8s"}`, animationEvent);
      }
    });
  };

  return {
    insertAnimation,
  };
};

export default useDynamicArrayAnimation;
