import { cn } from "@/lib/utils";
import type { CountingAux, CountingPhase } from "../_hooks/useCountingSort";
import "./countingAnimation.css";

const PHASE_LABEL: Record<CountingPhase, string> = {
  idle: "Ready",
  count: "Counting",
  prefix: "Accumulating",
  place: "Placing",
  done: "Done",
};

const PHASE_HELP: Record<CountingPhase, string> = {
  idle: "Press Sort to build the count table.",
  count: "Each cell counts how many times its value appears.",
  prefix: "Counts are added up so each cell holds where its value ends.",
  place: "Each cell shows the slots left for its value as bars move into place.",
  done: "Every bar is in its final slot.",
};

const ACTIVE_TAG: Partial<Record<CountingPhase, string>> = {
  count: "counting",
  prefix: "adding",
  place: "placing",
};

type Props = {
  aux: CountingAux;
  visible: boolean;
};

export default function CountingAuxPanel({ aux, visible }: Props) {
  if (!visible) return null;
  const tag = ACTIVE_TAG[aux.phase];

  return (
    <section
      aria-label="Counting sort count table"
      className="w-full border border-border bg-background p-3 text-foreground"
    >
      <p className="text-sm font-semibold">
        Phase: <span>{PHASE_LABEL[aux.phase]}</span>
      </p>
      <p className="mb-2 min-h-10 text-xs text-muted-foreground tablet:min-h-5">
        {PHASE_HELP[aux.phase]}
      </p>
      <div className="h-56 overflow-y-auto overflow-x-hidden tablet:h-44">
        {aux.values.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Only the values in your array get a cell, so the table stays short.
          </p>
        ) : (
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1 p-0">
            {aux.values.map((value) => {
              const isActive = aux.active === value - aux.min && aux.phase !== "done";
              return (
                <li
                  key={value}
                  className={cn(
                    "flex h-[4.5rem] flex-col items-center justify-between border border-border p-1 text-center",
                    isActive && "counting-cell-active outline outline-2 outline-ring",
                  )}
                >
                  <span className="text-xs text-muted-foreground">value {value}</span>
                  <span className="text-base font-semibold tabular-nums">
                    {aux.counts[value - aux.min] ?? 0}
                  </span>
                  <span className="h-3 text-[10px] leading-3">{isActive && tag ? tag : ""}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
