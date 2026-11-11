"use client";
import { type RefObject, useCallback, useMemo, useRef, useState } from "react";
import ConfigComponent from "@/components/app/ConfigComponent";
import OperationAnnouncer from "@/components/app/OperationAnnouncer";
import Properties from "@/components/app/Properties";
import SpeedComponent from "@/components/app/speedComponent";
import InputWithButtonContainer from "@/components/container/InputWithButtonContainer";
import OperationsContainer from "@/components/container/OperationsContainer";
import Section from "@/components/container/Section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { config } from "@/config";
import { useAnimationRunning } from "@/context/animationRunningContext";
import useResponsive from "@/hooks/useResponsive";
import { useSpeed } from "@/hooks/useSpeed";
import { useToast } from "@/hooks/useToast";
import { Edge } from "@/lib/classes/Edge";
import ButtonAction from "../../linear/_components/ButtonAction";
import BinaryTreeNode from "../tree/_classes/BinaryTreeNode";
import TreeVisualization from "../tree/_components/visualizations/treeVisualization";
import { TraversalType } from "../tree/types";
import AvlTreeNode from "./classes/AvlTreeNode";
import AvlBalanceBadge from "./components/AvlBalanceBadge";
import { useAvlTree } from "./hooks/useAvlTree";
import "@/entities/data-structures/non-linear/tree/animation.css";
import "./animation.css";

type Action = "insert" | "search" | "remove" | "createRandomTree";

function AvlTreeView() {
  const { toastInfo } = useToast();
  const { isAnimationRunning, setAnimationRunning } = useAnimationRunning();
  const [open, setOpen] = useState<boolean>(false);
  const { speed, handleSetSpeed } = useSpeed(3, config.localStorageKeys.speed.avlTree);
  const {
    treeLayout,
    insert,
    search,
    insertAnimation,
    remove,
    traverse,
    animateEdge,
    createRandomTree,
    clear,
    lastOperation,
    rotatingIds,
    maxTreeSize,
    minInputValue,
    maxInputValue,
  } = useAvlTree(speed);
  const [nodeSize, setNodeSize] = useState<number>(35);
  const device = useResponsive();
  const insertInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const removeInputRef = useRef<HTMLInputElement>(null);
  const randomTreeInputRef = useRef<HTMLInputElement>(null);
  const traverseActions = useRef<TraversalType[]>(["preOrder", "postOrder", "inOrder", "lvlOrder"]);
  const root = treeLayout.tree.root;

  const handleAction = useCallback(
    async (action: Action, input: HTMLInputElement | null) => {
      if (!input || isAnimationRunning) return;
      const num = parseFloat(input.value);
      if (
        Number.isNaN(num) ||
        (action !== "createRandomTree" && (num < minInputValue || num > maxInputValue)) ||
        (action === "createRandomTree" && (num < 1 || num > maxTreeSize))
      ) {
        toastInfo(
          `Input must be a number between ${action !== "createRandomTree" ? `${minInputValue} and ${maxInputValue}` : `${0} and ${maxTreeSize}`}`,
        );
        return;
      }
      setOpen(false);
      setAnimationRunning(true);
      switch (action) {
        case "insert":
          await insert(num, () => {
            setAnimationRunning(false);
          });
          break;
        case "search":
          await search(num);
          break;
        case "remove":
          await remove(num);
          break;
        case "createRandomTree":
          await createRandomTree(num);
          break;
      }
      if (action !== "insert") setAnimationRunning(false);
      input.value = "";
    },
    [isAnimationRunning, insert, search, remove, createRandomTree],
  );

  const handleTraverse = useCallback(
    async (traverseType: TraversalType) => {
      if (!treeLayout.tree.root) return;

      setOpen(false);
      setAnimationRunning(true);
      await traverse(traverseType);
      setAnimationRunning(false);
    },
    [treeLayout, traverse],
  );
  const onInsertAnimation = async (node: BinaryTreeNode<number>) => {
    await insertAnimation(node);
    setAnimationRunning(false);
  };
  const onCreateEdgeAnimation = async (edge: Edge) => {
    await animateEdge(edge, 0.5, true);
  };

  const makeResponsive = useMemo(() => {
    return root && device.twResponsive.laptop;
  }, [device, root]);

  const renderBadge = useCallback(
    (node: BinaryTreeNode<number>) => (
      <AvlBalanceBadge node={node} rotating={rotatingIds.has(node.id)} />
    ),
    [rotatingIds],
  );

  const renderInputAction = (
    key: string,
    ref: RefObject<HTMLInputElement | null>,
    title: string,
    action: "insert" | "search" | "delete" | "fill",
    onClick: () => Promise<void>,
    options: { min: number; max: number; responsive: boolean },
  ) => (
    <InputWithButtonContainer key={key} makeResponsive={options.responsive}>
      <Input
        ref={ref}
        aria-label={`${title} value`}
        placeholder="number"
        min={options.min}
        max={options.max}
        className={`text-black ${options.responsive ? "w-24" : "w-32"} text-center`}
        type="number"
      />
      <ButtonAction
        title={title}
        action={action}
        isLoading={isAnimationRunning}
        onClick={onClick}
      />
    </InputWithButtonContainer>
  );

  const renderControls = (responsive: boolean) => (
    <>
      {renderInputAction(
        "insert-action-avl",
        insertInputRef,
        "Insert",
        "insert",
        async () => handleAction("insert", insertInputRef.current),
        { min: minInputValue, max: maxInputValue, responsive },
      )}

      {root && (
        <>
          {renderInputAction(
            "search-action-avl",
            searchInputRef,
            "search",
            "search",
            async () => handleAction("search", searchInputRef.current),
            { min: minInputValue, max: maxInputValue, responsive },
          )}
          {renderInputAction(
            "remove-action-avl",
            removeInputRef,
            "remove",
            "delete",
            async () => handleAction("remove", removeInputRef.current),
            { min: minInputValue, max: maxInputValue, responsive },
          )}

          {responsive ? (
            <div className="flex items-start flex-col justify-start gap-2">
              <h6 className="text-lg font-semibold">Traversals:</h6>
              <div className="z-[105] flex items-center justify-center gap-1 flex-wrap">
                {traverseActions.current.map((action, i) => (
                  <ButtonAction
                    className="cursor-pointer text-sm px-1"
                    key={"traverse-action-" + action + i}
                    onClick={async () => {
                      await handleTraverse(action);
                    }}
                    title={action}
                    action="read"
                    isLoading={isAnimationRunning}
                  />
                ))}
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isAnimationRunning}
                className="cursor-pointer bg-app-bauhaus-yellow text-app-off-black rounded-md px-2 py-1 font-semibold"
              >
                <p>Traverse</p>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {traverseActions.current.map((action, i) => (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    key={"traverse-action-" + action + i}
                    onClick={async () => {
                      await handleTraverse(action);
                    }}
                  >
                    {action}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}

      {renderInputAction(
        "create-random-tree-action-avl",
        randomTreeInputRef,
        "Create Random Tree",
        "fill",
        async () => handleAction("createRandomTree", randomTreeInputRef.current),
        { min: 1, max: maxTreeSize, responsive },
      )}

      {root && (
        <ButtonAction
          title="Delete"
          action="delete"
          isLoading={isAnimationRunning}
          onClick={async () => {
            clear();
          }}
        />
      )}
    </>
  );

  return (
    <>
      <OperationAnnouncer message={lastOperation} />
      {!makeResponsive && (
        <OperationsContainer>
          <Section>{renderControls(false)}</Section>
        </OperationsContainer>
      )}

      <div className="w-full items-end justify-between flex">
        <Properties
          className={makeResponsive ? "hidden tablet:hidden laptop:flex" : ""}
          classNameMobile={makeResponsive ? "block tablet:block laptop:hidden" : ""}
          properties={{
            maxTreeSize: {
              value: maxTreeSize,
            },
            TreeSize: {
              value: `${treeLayout.tree.size} nodes`,
            },
            Height: {
              value: AvlTreeNode.heightOf(root),
            },
            Balanced: {
              value: "yes",
            },
            TreeLeftMostNode: {
              value: root ? treeLayout.tree.leftMostNode(root)!.data : null,
              show: treeLayout.tree.size > 0,
            },
            TreeRightMostNode: {
              value: root ? treeLayout.tree.rightMostNode(root)!.data : null,
              show: treeLayout.tree.size > 0,
            },
            minNodeValue: {
              value: minInputValue,
            },
            maxNodeValue: {
              value: maxInputValue,
            },
          }}
        />
        {makeResponsive && (
          <OperationsContainer
            enabled={!isAnimationRunning}
            className="z-[104]"
            open={open}
            setOpen={setOpen}
            makeResponsive={makeResponsive}
          >
            <Section makeResponsive={makeResponsive} className="z-[104]">
              {renderControls(true)}
            </Section>
          </OperationsContainer>
        )}
        <div className="flex items-center justify-center gap-4">
          <ConfigComponent
            available={!!root && !isAnimationRunning}
            messageWhenNotAvailable="Tree is not created yet or animation is running"
          >
            <div className="flex flex-col items-start justify-start">
              <div className="hidden tablet:block">
                <label htmlFor="avl-tree-size">Tree Size</label>
                <Input
                  id="avl-tree-size"
                  type="range"
                  min={25}
                  max={70}
                  value={nodeSize}
                  onChange={(e) => setNodeSize(parseInt(e.target.value, 10))}
                />
              </div>
              <SpeedComponent title="Animation Speed" speed={speed} setSpeed={handleSetSpeed} />
            </div>
          </ConfigComponent>
        </div>
      </div>

      <p className="px-4 pb-2 text-sm max-w-prose">
        Each node shows its balance factor (bf): left height minus right height. When it reaches +2
        or -2 the tree rotates to stay balanced.
      </p>

      <TreeVisualization<number, BinaryTreeNode<number>>
        onInsertAnimation={onInsertAnimation}
        onCreateEdgeAnimation={onCreateEdgeAnimation}
        treeLayout={treeLayout}
        nodeSize={nodeSize}
        renderBadge={renderBadge}
      />
    </>
  );
}

export default AvlTreeView;
