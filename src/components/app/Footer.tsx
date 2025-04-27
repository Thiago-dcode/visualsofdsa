'use client'

import { useAnimationRunning } from "@/context/animationRunningContext";
import { cn } from "@/lib/utils";

export default function Footer() {
    const { isAnimationRunning } = useAnimationRunning()
    return (
        <footer className="w-fullsticky bottom-0 left-0 right-0 ">
           
                <div className={cn("flex items-center justify-center gap-2  mt-40", {
                    "invisible": isAnimationRunning
                })}>
                    <p>© 2025 visualsofdsa</p>
                    <p>All rights reserved</p>
                </div>
            
        </footer>
    );
}
