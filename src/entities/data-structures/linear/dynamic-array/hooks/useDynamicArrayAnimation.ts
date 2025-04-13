import { Primitive, speed } from "@/types";
import Node from "../../_classes/Node";
import { DynamicArrayNode } from "../class/DynamicArrayNode";
import { animate } from "@/lib/animations";
import "./../animation.css";
import useAnimation from "@/hooks/useAnimation";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
const useDynamicArrayAnimation = (speed:speed) => {
  const {focus} = useAnimation()
  const speedRef = useRef<speed | null>(null);
  const getSpeed = useCallback(() => {
    if (!speedRef.current) return 0.5;
    switch (speedRef.current) {
      case 1:
        return 0.7;
      case 2:
        return 0.5;
      case 3:
        return 0.3;
      case 4:
        return 0.15;
      default:
        return 0.5;
    }
  }, []);
  
  useEffect(() => {
    speedRef.current = speed || speedRef.current;
  }, [speed]);
  const shiftAnimation = async (
    node: DynamicArrayNode<Primitive> | null,
    index: number,
    direction: "left" | "right"
  ): Promise<void> => {
    if (!node?.ref) {
      return;
    }
    const nodeRef = node.ref;
    const indexRef = node.indexRef;
    const endRef = nodeRef.parentElement?.parentElement?.parentElement
      ?.children[direction === "right" ? index + 1 : index - 1].children[1] as
      | HTMLElement
      | undefined;
    if (!endRef) return;
    const bondsRef = nodeRef.getBoundingClientRect();
    const bondsSibling = endRef.getBoundingClientRect();
    const properties = {
      startLeft: "0px",
      startTop: "0px",
      endLeft: bondsSibling.x - bondsRef.x + "px",
      endTop: bondsSibling.y - bondsRef.y + "px",
    };
    if (indexRef) {
      indexRef.textContent = indexRef.textContent
        ? parseInt(indexRef.textContent) +(direction === "right" ? 1 : -1) + ""
        : indexRef.textContent;
    }
    const animation = `${
      direction === "right" ? "insert" : "delete"
    }-node-dynamic-array`;
    focus(direction === "right" ? nodeRef : endRef);
 await Promise.all([
      animate(nodeRef, animation, getSpeed() * 0.8, {
        properties,
      }),
      animate(indexRef, animation, getSpeed() * 0.8, {
        properties,
      }),
    ]);
    const afterAnimation = (ref: HTMLElement) => {
      ref.style.left = properties.endLeft;
      ref.style.top = properties.endTop;
    };
    afterAnimation(nodeRef);
    if (indexRef) afterAnimation(indexRef);
  };
  const popAnimation = async (
    node: Node<Primitive> | null,
  ): Promise<void> => {
    if (!node || !node.ref) {
      return;
    } 
    focus(node.ref);
    await Promise.all([
        animate(node.ref,`pop-node`,getSpeed()),
        animate(node.indexRef,`pop-node`,getSpeed())
       ])
        node.ref.style.opacity = "0";
        if(node.indexRef) node.indexRef.style.opacity = "0";    
  };
  return {
    shiftAnimation,
    popAnimation,
  };
};

export default useDynamicArrayAnimation;
