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
        const nextNode = ref.parentElement?.parentElement?.parentElement?.children[index+1].children[1] as HTMLElement;
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
       let isBreakLine = false;
        if(nextNode){
              console.log("parent-"+index+1,nextNode)
          isBreakLine = ref.getBoundingClientRect().top !== nextNode.getBoundingClientRect().top
        }
        if(isBreakLine){
          ref.style.background = 'red'
          if(indexRef){
            // console.log('CURRENT NODE:', ref.getBoundingClientRect())
            // console.log('NEXT NODE:', nextNode.getBoundingClientRect())
            // indexRef.style.top = nextNode.getBoundingClientRect().top + 'px';
            console.log('CURRENT NODE TOP:', ref.getBoundingClientRect().top)
            console.log('NEXT NODE TOP:', nextNode.getBoundingClientRect().top)
            ref.style.bottom = nextNode.getBoundingClientRect().bottom + 'px';
            // indexRef.style.left = (nextNode.getBoundingClientRect().left - DynamicArrayNode.nodeSize) + 'px';
            // ref.style.left = (nextNode.getBoundingClientRect().left - DynamicArrayNode.nodeSize) + 'px';
          }
        }
      
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
