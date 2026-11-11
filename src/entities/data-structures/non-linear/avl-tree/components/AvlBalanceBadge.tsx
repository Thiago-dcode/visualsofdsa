import { cn } from "@/lib/utils";
import BinaryTreeNode from "../../tree/_classes/BinaryTreeNode";
import AvlTreeNode from "../classes/AvlTreeNode";

const formatBalance = (balance: number) => (balance > 0 ? `+${balance}` : `${balance}`);

type Props = {
  node: BinaryTreeNode<number>;
  rotating?: boolean;
};

/** Text label for the tree's `renderBadge` prop: `bf +1`, `bf 0`, `bf -1`. */
export default function AvlBalanceBadge({ node, rotating = false }: Props) {
  const balance = node instanceof AvlTreeNode ? node.balanceFactor : 0;
  const unbalanced = Math.abs(balance) > 1;
  return (
    <span className="flex flex-col items-center">
      <span
        className={cn("whitespace-nowrap bg-background px-0.5", {
          "text-destructive outline outline-1 outline-destructive px-1": unbalanced,
        })}
      >
        bf {formatBalance(balance)}
      </span>
      {rotating ? (
        <span className="whitespace-nowrap font-bold bg-background outline outline-1 outline-current px-1">
          rotating
        </span>
      ) : null}
    </span>
  );
}
