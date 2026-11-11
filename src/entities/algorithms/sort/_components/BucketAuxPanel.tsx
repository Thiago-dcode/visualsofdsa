import type { BucketAux, BucketPhase } from "../_hooks/useBucketSort";
import "./bucketAnimation.css";

type Props = {
  aux: BucketAux;
  visible: boolean;
  /** Array length, used to draw the empty buckets before the sort starts (no layout shift). */
  size?: number;
};

const PHASE_LABEL: Record<BucketPhase, string> = {
  idle: "Ready",
  scatter: "Scattering",
  sort: "Sorting buckets",
  gather: "Gathering",
  done: "Done",
};

const formatRange = (index: number, count: number, min: number, max: number) => {
  const width = (max - min + 1) / count;
  const low = min + index * width;
  const high = min + (index + 1) * width;
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return `${Math.ceil(low)}-${Math.max(Math.ceil(low), Math.ceil(high) - 1)}`;
  }
  return `${low.toFixed(2)}-${high.toFixed(2)}`;
};

export default function BucketAuxPanel({ aux, visible, size = 0 }: Props) {
  if (!visible) return null;
  const started = aux.buckets.length > 0;
  const count = started ? aux.buckets.length : Math.max(1, Math.ceil(Math.sqrt(size)));
  return (
    <section
      aria-label="Buckets"
      className="w-full border border-border p-3 text-sm text-foreground"
    >
      <p className="mb-2 min-h-5 font-semibold">
        Phase: <span>{PHASE_LABEL[aux.phase]}</span>
      </p>
      <div>
        <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 tablet:grid-cols-4 laptop:grid-cols-8">
          {Array.from({ length: count }, (_, index) => {
            const values = aux.buckets[index] ?? [];
            const isActive = aux.active === index && aux.phase !== "done";
            return (
              <li
                key={index}
                className={`flex h-36 min-w-0 flex-col gap-1 border p-2 ${
                  isActive
                    ? "bucket-aux-active border-2 border-ring outline outline-2 outline-offset-2 outline-ring"
                    : "border-border"
                }`}
              >
                <span className="text-xs font-semibold">
                  Bucket {index}
                  {started ? `: ${formatRange(index, count, aux.min, aux.max)}` : ""}
                </span>
                <span className="h-4 text-xs font-bold text-foreground">
                  {isActive ? PHASE_LABEL[aux.phase] : ""}
                </span>
                <ul className="m-0 flex min-h-0 list-none flex-wrap content-start gap-1 overflow-y-auto p-0">
                  {values.map((value, i) => (
                    <li key={i} className="bg-muted px-1.5 py-0.5 text-xs tabular-nums">
                      {value}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
