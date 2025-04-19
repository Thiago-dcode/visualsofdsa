import { appMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = appMetadata({robots:'noindex, nofollow'})

export default function Page() {
    return redirect("/data-structures")

    
}

