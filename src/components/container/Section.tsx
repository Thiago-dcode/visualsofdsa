import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  makeResponsive?: boolean;
};
export default function Section({ children, makeResponsive = false, className }: props) {
  return (
    <>
      {
        <div
          className={cn(
            "flex  items-start justify-start  flex-wrap w-full gap-4",
            {
              "flex-col items-end justify-start": makeResponsive,
            },
            className,
          )}
        >
          {children}
        </div>
      }
    </>
  );
}
