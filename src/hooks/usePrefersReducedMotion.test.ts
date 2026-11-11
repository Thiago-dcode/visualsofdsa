import { act, renderHook } from "@testing-library/react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Listener = (e: MediaQueryListEvent) => void;

const stubMatchMedia = (initial: boolean) => {
  const listeners = new Set<Listener>();
  const mql = {
    matches: initial,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: vi.fn((_: string, l: Listener) => listeners.add(l)),
    removeEventListener: vi.fn((_: string, l: Listener) => listeners.delete(l)),
  };
  const matchMedia = vi.fn(() => mql);
  vi.stubGlobal("matchMedia", matchMedia);
  Object.defineProperty(window, "matchMedia", {
    value: matchMedia,
    configurable: true,
    writable: true,
  });
  return {
    mql,
    matchMedia,
    emit: (matches: boolean) => {
      mql.matches = matches;
      for (const l of listeners) l({ matches } as MediaQueryListEvent);
    },
  };
};

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("AC-SH-2: returns true when the media query matches", () => {
    const { matchMedia } = stubMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(result.current).toBe(true);
  });

  it("AC-SH-2: returns false when it does not match", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("AC-SH-2: updates on the media query change event", () => {
    const { emit } = stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    act(() => emit(true));
    expect(result.current).toBe(true);
    act(() => emit(false));
    expect(result.current).toBe(false);
  });

  it("AC-SH-2: unsubscribes on unmount", () => {
    const { mql } = stubMatchMedia(false);
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });
});
