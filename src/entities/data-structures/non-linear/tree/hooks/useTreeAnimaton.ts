import { animate } from "@/lib/animations";
import { Primitive } from "@/types";
import Tree from "../_classes/Tree";
import { OnCompare, OnRemove, OnFindSuccessor, OnTraversal } from "../types";
import TreeNode from "../_classes/TreeNode";
import { toast } from "sonner";
import useAnimation from "@/hooks/useAnimation";
import { speed } from "@/types";
import { g } from "vitest/dist/suite-DCPwkk7G.js";
const useTreeAnimaton = <T extends Primitive, K extends TreeNode<T>>(
  tree: Tree<T, K>,
  speed:speed
) => {

  const getSpeed = () => {
    switch(speed){
      case 1:
        return 0.8
      case 2:
        return 0.5
      case 3:
        return 0.3
      case 4:
        return 0.2
        
    }
  }
  const {animateEdge,focus} = useAnimation()
  const onTraversal: OnTraversal<T, K> = async (node, edge) => {
    if (!node.ref) return 
    focus(node.ref)
    await animate(node.ref, `find-node ${getSpeed()}s`);
    if (edge && edge.ref) await animateEdge(edge,0.5,false);
  };

  const onCompareAnimation: OnCompare<T, K> = async (
    node,
    edge,
    data,
    oppositeNode
  ) => {
    if (oppositeNode) await oppositeBranchAnimation(oppositeNode, false);
    if (edge && edge.ref) {
      await animate(edge.ref, `lit-node-edge ${0.5}s`);
    }
    if (node.ref) {
      focus(node.ref)
      await animate(
        node.ref,
        `${node.data === data ? `find-node ${0.8}s` : `compare-node ${0.5}s`}`
      );
     
    }
  };
  const findSuccessor: OnFindSuccessor<T, K> = async (
    node,
    edge,
    isFirstCall,
    found
  ) => {
    let toastId: string | number | undefined;
    if (isFirstCall) {
      toastId = toast.loading("Finding successor...", {
        duration: Infinity,
      });
    }
    focus(node.ref);
  
    await animate(node.ref, `find-node ${0.8}s`, () => {

    });

    if (edge && edge.ref){
 
      await animateEdge(edge,0.5);
    
    };

    if (found) {
      toast.dismiss(toastId);
    }
  };
  const onRemoveAnimation: OnRemove<T, K> = async (
    node,
    successor,
    isCaseThree
  ) => {
    const nodeRef = node.ref;

    if (!nodeRef) return;
    if (successor && successor.ref) {
      const successorRef = successor.ref;
      if (!isCaseThree) {
        await animate(nodeRef, `remove-node ${0.8}s`, () => {});

        nodeRef.style.display = "none";
      }
      successorRef.style.setProperty(
        "--left_from",
        `${successor.position.x}px`
      );
      successorRef.style.setProperty("--top_from", `${successor.position.y}px`);
      successorRef.style.setProperty("--left_to", `${node.position.x}px`);
      successorRef.style.setProperty("--top_to", `${node.position.y}px`);
      focus(successorRef)
      await animate(successorRef, `move-node ${0.8}s`, () => {});
      successor.position.x = node.position.x;
      successor.position.y = node.position.y;
      successorRef.style.left = `${successor.position.x}px`;
      successorRef.style.top = `${successor.position.y}px`;

      if (isCaseThree) {
        nodeRef.style.visibility = "visible";
      }
    } else {
      await animate(nodeRef, `remove-node ${0.8}s`, () => {});
      nodeRef.style.visibility = "hidden";
    }
  };
  const insertAnimation = async (node: K) => {
    focus(node.ref)
    await animate(node.ref, `insert-node ${0.8}s`, () => {}, true);
    await oppositeBranchAnimation();
    node.isLastAdd = false;
  };

  const oppositeBranchAnimation = async (
    branch: K | null = null,
    enable = true
  ) => {
    await tree.inOrderTraversal(branch||tree.root , async (node) => {
      animate(
        node.ref,
        `${enable ? "enable" : "disable"}-node ${0.5}s`,
        (ref) => {
          if (node.ref) {
            if (enable) {
              node.ref.style.opacity = "1";
              node.ref.style.transform = "scale(1)";
            } else {
              node.ref.style.opacity = "0.4";
              node.ref.style.transform = "scale(0.8)";
            }
          }
        }
      );
    });
  };
  return {
    onCompareAnimation,
    insertAnimation,
    oppositeBranchAnimation,
    onRemoveAnimation,
    findSuccessor,
    onTraversal,
    animateEdge,

  };
};

export default useTreeAnimaton;
