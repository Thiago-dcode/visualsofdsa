import { useState } from "react";
import LinearDs from "../_classes/LinearDs";
import { Primitive } from "@/types";
import { delay, getSpeed } from "@/lib/utils";
import UseStackAnimation from "../stack/hooks/UseStackAnimation";

function UseLinear(linearDs: LinearDs<Primitive> | null) {
  const [isFilling, setIsFilling] = useState(false);
  const [_render, setRender] = useState(false);
  const {handlePeekAnimation} = UseStackAnimation(linearDs);
  const flush = (callBack = () => {}) => {
    if (linearDs == null) {
      return;
    }
    setIsFilling(false);
    callBack()
    linearDs.flush();
  };
  const fill = async (
    i = 0,
    spaceRemaining: number,
    callBackFiller: (data: Primitive) => Promise<boolean>
  ) => {
    if (!linearDs) return;
    setIsFilling(true);
    const _delay = getSpeed(linearDs.speed) * 1000;

    if (spaceRemaining <= i) {
      setIsFilling(false);

      return;
    }
    i++;
    await callBackFiller("let foo = " + i);
    await delay(_delay);
    await fill(i, spaceRemaining, callBackFiller);
  };
  const render = (clean = false) => {
    if (clean && linearDs != null && linearDs?.size > 0) {
      flush();
    }
    setRender((prev) => !prev);
  };
  const peek = async (callback = ()=>{}) => {
    return new Promise(async (resolve, reject) => {
      if (
        linearDs == null ||
        !linearDs.peekNode() ||
        !linearDs.peekNode()?.ref
      ) {
        reject(false);
      } else {
       
        const ref = linearDs.peekNode()?.ref;
        if (!ref) reject(false);
        else {
          await handlePeekAnimation(ref, () => {
            resolve(true);
          });
        }
        callback()
      }
    });
  };
  const empty = async (callBackEmptier: () => Promise<boolean>) => {
    setIsFilling(true);
    if (!linearDs) {
      flush();
      return;
    }
    if (linearDs.size <= 0) {
      setIsFilling(false);
      return;
    }
    await callBackEmptier();
    render();
   await empty(callBackEmptier);
  };
  return {
    render,
    _render,
    isFilling,
    fill,
    flush,
    empty,
    peek
  };
}

export default UseLinear;
