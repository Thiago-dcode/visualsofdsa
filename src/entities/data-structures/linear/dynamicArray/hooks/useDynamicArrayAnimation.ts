import { Primitive } from "@/types";
import { delay, removePx, requestAnimation } from "../../../../../lib/utils";
import Node from "../../_classes/Node";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
const useDynamicArrayAnimation = () => {
  const insertAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    index: number,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
    normalBehavior = false
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef = node.ref.parentElement?.parentElement
          ?.children[2] as HTMLElement;
        const nextNode = ref.parentElement?.parentElement?.parentElement
          ?.children[index + 1].children[1] as HTMLElement;
        let isBreakLine = false;
        const animationEvent = async (e: AnimationEvent) => {
          if (onAnimationEnds && !normalBehavior) {
            onAnimationEnds(e);
          }
          if (isBreakLine && indexRef) {
            const left = `-${
              Math.abs(removePx(ref.style.left)) - DynamicArrayNode.nodeSize
            }px`;

            ref.style.left = left;
            indexRef.style.left = left;
          } else if (true) {
            ref.style.left = DynamicArrayNode.nodeSize + "px";
            if (indexRef) {
              indexRef.style.left = DynamicArrayNode.nodeSize + "px";
              indexRef.removeEventListener("animationend", animationEvent);
            }
          }

          ref.removeEventListener("animationend", animationEvent);
          resolve(true);
        };
        if(indexRef&& indexRef.textContent){
          const prevIndex = parseInt(indexRef.textContent);
          if(!isNaN(prevIndex)){
            indexRef.textContent =  (prevIndex+1)+'';
          }
        }

        if (nextNode) {
          isBreakLine =
            ref.getBoundingClientRect().top !==
            nextNode.getBoundingClientRect().top;
        }
        if (isBreakLine && indexRef) {
          const top =
            Math.abs(
              ref.getBoundingClientRect().top -
                nextNode.getBoundingClientRect().top
            ) + "px";
          const left = `-${
            ref.getBoundingClientRect().x -
            nextNode.getBoundingClientRect().x +
            DynamicArrayNode.nodeSize
          }px`;

          try {
            await new Promise((resolve) => {
              let refDone = false;
              const _animationEventRef = () => {
                ref.style.top = top;

                ref.style.left = left;
                ref.removeEventListener("animationend", _animationEventRef);

                refDone = true;
                if (refDone && indexRefDone) resolve(true);
              };
              let indexRefDone = false;
              const _animationEventIndexRef = () => {
                indexRef.style.top = top;

                indexRef.style.left = left;
                indexRef.removeEventListener(
                  "animationend",
                  _animationEventIndexRef
                );

                indexRefDone = true;
                if (refDone && indexRefDone) resolve(true);
              };
              indexRef.style.setProperty(
                "--end",
                `${DynamicArrayNode.nodeSize / 2}px`
              );
              requestAnimation(
                indexRef,
                `insert-node ${"0.4s"}`,
                _animationEventIndexRef
              );
              ref.style.setProperty(
                "--end",
                `${DynamicArrayNode.nodeSize / 2}px`
              );
              requestAnimation(
                ref,
                `insert-node ${"0.4s"}`,
                _animationEventRef
              );
            });
          } catch (error) {}
        }

        if (indexRef) {
          indexRef.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);
          const fn = () => {
            indexRef.removeEventListener("animationend", animationEvent);
          };

          requestAnimation(indexRef, `insert-node ${"0.4s"}`, fn);
        }
        ref.style.setProperty("--end", `${DynamicArrayNode.nodeSize}px`);

        requestAnimation(ref, `insert-node ${"0.4s"}`, animationEvent);
      }
    });
  };
  const deleteAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    index: number,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
    normalBehavior = false
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef = node.ref.parentElement?.parentElement
          ?.children[2] as HTMLElement;
        const prevNode = ref.parentElement?.parentElement?.parentElement
          ?.children[index - 1]?.children[1] as HTMLElement;
        let isBreakLine = false;
        const animationEvent = async (e: AnimationEvent) => {
          if (onAnimationEnds && !normalBehavior) {
            onAnimationEnds(e);
          }

          if (isBreakLine && indexRef) {
            const left = `${
              Math.abs(removePx(ref.style.left)) - DynamicArrayNode.nodeSize
            }px`;

            ref.style.left = left;
            indexRef.style.left = left;
          } else {
            ref.style.left = "-" + DynamicArrayNode.nodeSize + "px";
            indexRef
              ? (indexRef.style.left = "-" + DynamicArrayNode.nodeSize + "px")
              : null;
          }

          if (indexRef) {
            indexRef.removeEventListener("animationend", animationEvent);
          }

          ref.removeEventListener("animationend", animationEvent);
          resolve(true);
        };
      if(indexRef&& indexRef.textContent){
        const prevIndex = parseInt(indexRef.textContent);
        if(!isNaN(prevIndex)){
          indexRef.textContent =  (prevIndex-1)+'';
        }
      }
        if (prevNode) {
          isBreakLine =
            ref.getBoundingClientRect().top !==
            prevNode.getBoundingClientRect().top;
        }
        if (isBreakLine && indexRef) {
          const left = `${Math.abs(
            ref.getBoundingClientRect().x -
              prevNode.getBoundingClientRect().x -
              DynamicArrayNode.nodeSize
          )}px`;
          const top =
            "-" +
            Math.abs(
              ref.getBoundingClientRect().top -
                prevNode.getBoundingClientRect().top
            ) +
            "px";
          try {
            await new Promise((resolve) => {
              let refDone = false;
              const _animationEventRef = () => {
                ref.style.top = top;
                ref.style.left = left;
                ref.removeEventListener("animationend", _animationEventRef);

                refDone = true;
                if (refDone && indexRefDone) resolve(true);
              };
              let indexRefDone = false;
              const _animationEventIndexRef = () => {
                indexRef.style.top = top;

                indexRef.style.left = left;
                indexRef.removeEventListener(
                  "animationend",
                  _animationEventIndexRef
                );

                indexRefDone = true;
                if (refDone && indexRefDone) resolve(true);
              };
              indexRef.style.setProperty(
                "--end",
                `-${DynamicArrayNode.nodeSize / 2}px`
              );
              requestAnimation(
                indexRef,
                `insert-node ${"0.4s"}`,
                _animationEventIndexRef
              );
              ref.style.setProperty(
                "--end",
                `-${DynamicArrayNode.nodeSize / 2}px`
              );
              requestAnimation(
                ref,
                `insert-node ${"0.4s"}`,
                _animationEventRef
              );
            });
          } catch (error) {}
        }
        if (indexRef) {
          indexRef.style.setProperty(
            "--end",
            `-${DynamicArrayNode.nodeSize}px`
          );
          const fn = () => {
            indexRef.removeEventListener("animationend", animationEvent);
          };

          requestAnimation(indexRef, `insert-node ${"0.4s"}`, fn);
        }
        ref.style.setProperty("--end", `-${DynamicArrayNode.nodeSize}px`);
        requestAnimation(ref, `insert-node ${"0.4s"}`, animationEvent);
      }
    });
  };
  const popAnimation = async (
    node: Node<Primitive> | null,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null,
    speed = 1
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (!node || !node.ref) {
        reject(false);
      } else {
        const ref = node.ref;
        const indexRef = node.ref.parentElement?.parentElement
          ?.children[2] as HTMLElement;
        const animationEvent = (e: AnimationEvent) => {
          if (onAnimationEnds) {
            onAnimationEnds(e);
          }
          resolve(true);
          ref.style.display = "none";
          if (indexRef) indexRef.style.visibility = "hidden";
          ref.removeEventListener("animationend", animationEvent);
        };

        if (indexRef) {
          requestAnimation(indexRef, `pop-node ${speed}s`, animationEvent);
        }
        requestAnimation(ref, `pop-node ${speed}s`, animationEvent);
      }
    });
  };
  return {
    insertAnimation,
    popAnimation,
    deleteAnimation,
  };
};

export default useDynamicArrayAnimation;
