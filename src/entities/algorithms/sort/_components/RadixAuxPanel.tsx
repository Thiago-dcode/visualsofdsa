import { cn } from "@/lib/utils";
import { getDigitName, RadixAux } from "../_hooks/useRadixSort";
import "./radixAnimation.css";

const PHASE_LABEL: Record<RadixAux["phase"], string> = {
  idle: "Ready",
  distribute: "Distributing",
  collect: "Collecting",
  done: "Sorted",
};

export default function RadixAuxPanel({ aux, visible }: { aux: RadixAux; visible: boolean }) {
  if (!visible) return null;
  const hasPass = aux.totalPasses > 0;
  return (
    <section
      aria-label="Radix sort digit buckets"
      className="w-full border border-border text-foreground"
    >
      <p className="min-h-10 px-3 py-2 text-sm font-medium">
        {hasPass
          ? `Pass ${aux.digitPosition + 1} of ${aux.totalPasses} (${getDigitName(aux.digitPosition)} digit)`
          : "Radix sort passes"}
        {" - "}
        {PHASE_LABEL[aux.phase]}
      </p>
      <ol className="m-0 grid list-none grid-cols-5 gap-1 px-3 pb-3 tablet:grid-cols-10">
        {aux.buckets.map((bucket, digit) => {
          const isActive = aux.active === digit && aux.phase !== "done";
          return (
            <li
              // Digits are fixed positions 0-9.
              key={digit}
              className={cn(
                "flex h-36 min-w-0 flex-col border border-border p-1 text-xs",
                isActive && "radix-bucket-active outline outline-2 outline-ring",
              )}
            >
              <span className="text-center font-semibold">Digit {digit}</span>
              <span className="h-4 text-center text-[10px] leading-4">
                {isActive ? (aux.phase === "collect" ? "collecting" : "adding") : ""}
              </span>
              <ul className="m-0 mt-auto flex min-h-0 list-none flex-col-reverse gap-1 overflow-y-auto p-0">
                {bucket.map((value, i) => (
                  <li key={i} className="bg-app-bauhaus-yellow-50 px-1 text-center tabular-nums">
                    {value}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
