import { useCallback, useMemo, useRef, useState } from "react";
import LinearDs from "../_classes/LinearDs";
import { Primitive, speed } from "@/types";
import UseLinearDsAnimation from "./UseLinearDsAnimation";
import { toast } from "sonner";
import StackOverFlowError from "@/lib/errors/StackOverFlowError";
import { useSpeed } from "@/hooks/useSpeed";
import { config as appConfig } from "@/config";
import { random } from "@/lib/utils";
import LinkedListNode from "../linked-list/classes/LinkedListNode";
import useResponsive from "@/hooks/useResponsive";
const MAX_WIDTH = 600
function UseLinear(linearDs: LinearDs<Primitive>) {
  const { speed, handleSetSpeed } = useSpeed(
    linearDs.speed,
    appConfig.localStorageKeys.speed.linearDs
  );
  const [config, _setConfig] = useState({
    maxSize: linearDs.maxSize,
    width: linearDs.width,
    height: (linearDs.nodeHeight + linearDs.nodeHeightSpacing) * linearDs.maxSize,
    speed,
  });
  const { width, height } = useResponsive((e, device, sizeChanged) => {
    if (sizeChanged.width) setConfig('width', device.width < MAX_WIDTH ? device.width - 50 : MAX_WIDTH / 1.5)

  })
  const {
    handlePeekAnimation,
    handleRemoveAnimation,
    handleAddAnimation,
    handleFillerAnimation,
    handleEmptyAnimation,
    handleMoveNodesAnimation,
  } = UseLinearDsAnimation(linearDs, config.speed, config.height > height);
  const [nodeArray, _setNodeArray] = useState<
    LinkedListNode<Primitive>[] | null
  >(null);
  const [isStackOverFlow, setIsStackOverFlow] = useState(false);
  const toastFillerId = useRef<string | number | null>(null);
  const flush = () => {
    _setNodeArray(null);
    setIsStackOverFlow(false);
    linearDs.flush();
  };
  const setConfig = useCallback(
    (key: keyof typeof config, value: number) => {
      const _config = { ...config, [key]: value };

      if (key === "speed") handleSetSpeed(value as speed);
      if (key === "maxSize") {
        flush();
        linearDs.maxSize = value
        _config.height = (linearDs.nodeHeight + linearDs.nodeHeightSpacing) * linearDs.maxSize
      };
      _setConfig(_config);
    },

    [config]
  );
  const setNodeArray = () => {
    _setNodeArray(linearDs.toNodeArray);
  };


  const add = async (data: Primitive) => {
    try {
      const node = await linearDs.add(data);
      node.isLastAdd = true;
      setNodeArray();
    } catch (error) {
      if (error instanceof StackOverFlowError) {
        setIsStackOverFlow(true);
      }
    }
  };
  const remove = async () => {
    const node = await linearDs.remove();
    if (!node) {
      toast.error(`${linearDs?.name} is empty`);
      return;
    }
    await handleRemoveAnimation(node);
    if (linearDs.name === "queue") await handleMoveNodesAnimation();
    setNodeArray();
  };
  const peek = async () => {
    const peekNode = linearDs?.peekNode();
    if (!peekNode) {
      toast.info(`${linearDs?.name} is empty`);
      return;
    }
    await handlePeekAnimation(peekNode);
  };

  const fill = async (callbackWhenFull: () => void) => {
    const remainingSpace = linearDs.maxSize - linearDs.size;
    if (remainingSpace <= 0) {
      if (remainingSpace === 0) {
        await empty();
        callbackWhenFull();
      }
      return;
    }
    toastFillerId.current = toast.loading(`Filling ${linearDs?.name}`, {
      position: "top-center",
    });
    for (let i = 0; i < remainingSpace; i++) {
      const node = await linearDs.add(`data-${random(0, 2464)}`);
      if (node) {
        node.isFiller = true;
        if (i === remainingSpace - 1) node.isLastAdd = true;
      }
    }
    setNodeArray();
  };
  const dismissFillerToast = () => {
    if (toastFillerId.current) {
      toast.dismiss(toastFillerId.current);
      toastFillerId.current = null;
    }
  };
  const empty = useCallback(async () => {
    if (!nodeArray) return;
    const toastId = toast.loading(`Emptying ${linearDs?.name}`, {
      position: "top-center",

    },);
    await handleEmptyAnimation(nodeArray);
    linearDs.flush();
    setNodeArray();
    toast.dismiss(toastId);
  }, [nodeArray]);

  return {
    linearDs,
    add,
    remove,
    peek,
    fill,
    flush,
    empty,
    nodeArray,
    isStackOverFlow,
    handleAddAnimation,
    handleFillerAnimation,
    config,
    setConfig,
    dismissFillerToast,
    maxWidth: Math.min(width - 50, MAX_WIDTH),

  };
}

export default UseLinear;
