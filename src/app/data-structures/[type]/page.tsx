import { redirect } from "next/navigation";
import { appMetadata } from "@/lib/metadata";

export const metadata = appMetadata({ robots: "noindex, nofollow" });

export default function Page() {
  return redirect("/data-structures");
}
