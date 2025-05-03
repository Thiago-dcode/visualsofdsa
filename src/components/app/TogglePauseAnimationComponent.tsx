import { useAnimationRunning } from "@/context/animationRunningContext"
import { Switch } from "../ui/switch"
import { useMuted } from "@/context/muteContext";

export default function TogglePauseAnimationComponent() {
    const { isAnimationEnabled, setAnimationEnabled } = useAnimationRunning();
 
    return <Switch title="Enable/Disable animations" checked={isAnimationEnabled} onCheckedChange={setAnimationEnabled} />
}

