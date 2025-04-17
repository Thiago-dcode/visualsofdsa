import { Primitive, speed } from "@/types";

import LinearDs from "../_classes/LinearDs";
import { animate } from "@/lib/animations";
import Node from "../_classes/Node";
import "../animation.css";
import LinkedListNode from "../linked-list/classes/LinkedListNode";
import useAnimation from "@/hooks/useAnimation";
const UseLinearDsAnimation = (linearDs: LinearDs<Primitive>, speed: speed) => {
  const { focus } = useAnimation()
  const getSpeed = () => {
    switch (speed) {
      case 1:
        return 0.8;
      case 2:
        return 0.6;
      case 3:
        return 0.4;
      case 4:
        return 0.2;
      default:
        return 0.5;
    }
  };
  const handleAddAnimation = async (
    node: Node<Primitive>,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    const ref = node.ref;
    if (!ref) return false;
    focus(ref)
    return await animate(
      ref,
      `add-node-linear`,
      getSpeed(),
      {
        properties: {
          start: `${linearDs?.beginner}px`,
          end: `${node.position.y}px`,
        },
        onAnimationEnds,
        onlyOnce: true,
      }
    );
  };
  const handleRemoveAnimation = async (
    node: Node<Primitive>,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    const ref = node.ref;
    if (ref == null) {
      return false;
    }
    const end =
      linearDs.name === "queue"
        ? linearDs.maxSize *
        (linearDs.nodeHeightSpacing + linearDs.nodeHeight) +
        50
        : linearDs.beginner;
    focus(ref)
    return await animate(
      ref,
      `remove-node-linear`,
      getSpeed(),
      {
        properties: {
          start: `${node.position.y}px`,
          end: `${end}px`,
        },
        onAnimationEnds: (e) => {
          if (onAnimationEnds) onAnimationEnds(e);

          ref.style.display = "none";
        },
        onlyOnce: true,
      }
    );
  };
  const handleMoveNodesAnimation = async (
    nodeArray = linearDs.toNodeArray
  ): Promise<void> => {
    await Promise.all(
      nodeArray.map((node) => {
        const ref = node.ref;
        if (ref) {
          const end =
            node.position.y +
            (linearDs.nodeHeight + linearDs.nodeHeightSpacing);
          return animate(ref, `move-node-linear`, getSpeed() * 0.7, {
            properties:{
              start: `${node.position.y}px`,
              end: `${end}px`,
            },
            onAnimationEnds: (e) => {
              
              ref.style.bottom = `${end}px`;
              node.position.y = end;
            },
         
          });
        }
        return Promise.resolve();
      })
    );
  };

  const handlePeekAnimation = async (
    node: Node<Primitive>,
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<boolean> => {
    focus(node.ref)
    return await animate(node.ref, `peek-node-linear`, getSpeed() * 1.1, {
      onAnimationEnds
    });
  };
  const handleFillerAnimation = async (
    nodeArrayOfFiller: Node<Primitive>[],
    onAnimationEnds: ((e: AnimationEvent) => void) | null = null
  ): Promise<void> => {
    if (nodeArrayOfFiller.length === 0) return;
    for (let i = 0; i < nodeArrayOfFiller.length; i++) {
      const node = nodeArrayOfFiller[i];
      if (node.ref) {
        node.isFiller = false;
        node.isLastAdd = false;
        node.ref.style.visibility = "visible";
        await handleAddAnimation(node, onAnimationEnds);
      }
    }
  };
  const handleEmptyAnimation = async (
    nodeArray: LinkedListNode<Primitive>[]
  ): Promise<void> => {
    if (nodeArray.length === 0) return;
    switch (linearDs.name) {
      case "stack":
        for (let i = nodeArray.length - 1; i >= 0; i--) {
          await handleRemoveAnimation(nodeArray[i]);
        }
        break;
      case "queue":
        for (let i = 0; i < nodeArray.length; i++) {
          await handleRemoveAnimation(nodeArray[i]);
          await handleMoveNodesAnimation(nodeArray.filter((_, j) => j > i));
        }

        break;
      default:
        break;
    }
  };
  return {
    handleAddAnimation,
    handleRemoveAnimation,
    handlePeekAnimation,
    handleFillerAnimation,
    handleEmptyAnimation,
    handleMoveNodesAnimation,
  };
};

export default UseLinearDsAnimation;
