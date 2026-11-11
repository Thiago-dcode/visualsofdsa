import type { HeapHighlightKind } from "../hooks/useBinaryHeap";

type Props = {
  index: number;
  tag?: HeapHighlightKind;
};

/** Text label shown under a tree node: its array index and, while active, what is happening. */
export default function HeapIndexBadge({ index, tag = null }: Props) {
  return (
    <span className="flex flex-col items-center font-mono whitespace-nowrap">
      <span>{`i=${index}`}</span>
      {tag ? <span className="font-bold underline">{tag}</span> : null}
    </span>
  );
}
