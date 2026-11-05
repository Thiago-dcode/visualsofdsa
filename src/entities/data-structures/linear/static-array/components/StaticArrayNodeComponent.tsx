import { useCallback } from "react";
import { Primitive } from "@/types";
import Node from "../../_classes/Node";
import LinearNodeComponent from "../../_components/LinearNodeComponent";
import UseStaticArrayAnimation from "../hooks/UseStaticArrayAnimation";

type props = {
  node: Node<Primitive>;
  setAnimationRunning: (value: boolean) => void;
};
export default function StaticArrayNodeComponent({ node, setAnimationRunning }: props) {
  const { createAnimation } = UseStaticArrayAnimation(2);
  const setRef = useCallback(async (ele: HTMLElement | null) => {
    if (!ele) return;
    node.ref = ele;
    if (node.isLastAdd) {
      await createAnimation(node, () => {
        setAnimationRunning(false);
        node.isLastAdd = false;
      });
    }
  }, []);
  return (
    <LinearNodeComponent
      key={"LinearNodeComponent-" + node.id}
      ref={(e) => {
        setRef(e);
      }}
      node={node}
      dsType="staticArray"
      className="h-full relative"
    />
  );
}
