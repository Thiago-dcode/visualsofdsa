import { cn } from "@/lib/utils";
import type { HeapHighlight } from "../hooks/useBinaryHeap";

type Props = {
  array: number[];
  highlight: HeapHighlight;
};

/** The heap as the array that backs it. Cells show their index above and value inside. */
export default function HeapArrayStrip({ array, highlight }: Props) {
  return (
    <section
      aria-label="Heap as an array"
      // Scrolls inside its own box, so it must be reachable by keyboard.
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region
      tabIndex={0}
      className="w-full h-28 overflow-x-auto overflow-y-hidden border-b-2 border-app-off-gray px-4 py-2"
    >
      {array.length === 0 ? (
        <p className="text-sm text-foreground">The heap is empty. Insert a value to begin.</p>
      ) : (
        <ol className="flex items-start gap-2 w-max">
          {array.map((value, i) => {
            const active = highlight.kind !== null && highlight.indices.includes(i);
            const key = `heap-cell-${i}`;
            return (
              <li key={key} className="flex flex-col items-center gap-1 w-12">
                <span className="text-xs font-mono text-foreground">{i}</span>
                <span
                  className={cn(
                    "flex h-10 w-12 items-center justify-center border-2 border-app-off-black dark:border-app-off-white text-sm font-semibold text-foreground",
                    { "outline outline-2 outline-offset-2 outline-ring": active },
                  )}
                >
                  {value}
                </span>
                <span className="h-4 text-[10px] leading-4 text-foreground">
                  {active ? highlight.kind : ""}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
