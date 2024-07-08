import { useEffect, useState } from "react";
import Stack from "../classes/Stack";
import { Primitive } from "@/types";
import UseStackAnimation from "./UseStackAnimation";

export const UseStack = () => {
  const [stack, setStack] = useState<Stack<Primitive> | null>(null);
  const { handlePopAnimation, handlePushAnimation } =
    UseStackAnimation(stack);
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);
  const push = (data: Primitive): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (stack && stack.size >= stack.maxSize) {
        setIsStackOverFlow(true);
        reject(false);
      }
      if (stack) {
        stack.push(data);
        resolve(true);
      }
    });
  };
  const pop = async (callback = () => {}): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (stack == null || !stack.peekNode() || !stack.peekNode()?.ref) {
        reject(false);
      } else {
        // setStop(false);
        const ref = stack.peekNode()?.ref;
        if (!ref) reject(false);
        else {
          await handlePopAnimation(ref, () => {
            ref.style.display = "none";
            stack.pop();

            resolve(true);
          });
        }
      }
      callback();
    });
  };

  useEffect(() => {
    setStack(new Stack());
  }, []);

  return {
    stack,
    push,
    pop,
    handlePushAnimation,
    isStackOverFlow,
    setIsStackOverFlow,
  };
};
