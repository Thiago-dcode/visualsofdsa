import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import React, { useState } from "react"
import { TriangleAlert } from "lucide-react"
import { config } from "@/config"
export function PopOverComponent({
  trigger,
  content,
  handleOnClick = () => { },
  setOpen = undefined,
  showBtn = false,
  className = '',
  open = false,
  available = true,
  messageWhenNotAvailable = 'Not available yet'
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  handleOnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  showBtn?: boolean,
  className?: string,
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
  available?: boolean,
  messageWhenNotAvailable?: string
}) {

  const [_open, _setOpen] = useState(false);
  return (
    <Popover  onOpenChange={(e) => {
      if (!setOpen) {
        _setOpen(e)
        return;
      }
      setOpen(e)
    }} defaultOpen={false} open={setOpen ? open : _open} >
      <PopoverTrigger type="submit" onSubmit={(e) => {
        e.preventDefault()

      }} onClick={() => {
        if(!available) return;
        if (!setOpen) {
          _setOpen(!_open)
          return;
        }
        setOpen(!open)
      }} asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent id="pop-over" className={cn(config.darkModeModal, 'w-50', className)}>
        { available ?
          content
        : <div className="p-2 flex items-center gap-2">
            <TriangleAlert className="w-4 h-4 text-app-bauhaus-red" />
            <p className="text-app-bauhaus-red font-medium">{messageWhenNotAvailable}</p>
          </div>}
        {showBtn && <Button onClick={(e) => {
          handleOnClick(e)
        }} variant="ghost" >submit</Button>}
      </PopoverContent>
    </Popover>
  )
}
