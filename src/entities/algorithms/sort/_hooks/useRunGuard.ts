import { useEffect, useRef } from "react";

/** Thrown inside sort callbacks to unwind a run whose page was left or whose array was reset. */
export class RunAborted extends Error {
  constructor() {
    super("Sort run aborted");
    this.name = "RunAborted";
  }
}

/**
 * Lets a sort hook stop a run that is no longer wanted (unmounted page, Delete/reset mid-run).
 * `begin()` starts a run and returns a `check` to call at the top of every callback and after
 * every await: it throws `RunAborted` once the run is stale, which unwinds the sort class before it
 * touches sound, animations, state or the array.
 */
export const useRunGuard = () => {
  const mounted = useRef(true);
  const generation = useRef(0);

  useEffect(() => {
    // Set in the effect body too so React Strict Mode's mount/unmount/mount keeps it true.
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current++;
    };
  }, []);

  const begin = () => {
    const mine = ++generation.current;
    return () => {
      if (!mounted.current || mine !== generation.current) throw new RunAborted();
    };
  };
  const abort = () => {
    generation.current++;
  };
  return { begin, abort };
};

/** Skip sounds for bars whose element is gone (page left). */
export const isAudible = (node: { ref: HTMLElement | null }) => !node.ref || node.ref.isConnected;
