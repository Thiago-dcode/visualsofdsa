import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react"

export function PopOverComponent({
  trigger,
  content,
  handleOnClick = () => { },
  setOpen = undefined,
  showBtn = false,
  className = '',
  open = false
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  handleOnClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  showBtn?: boolean,
  className?: string,
  open?: boolean,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
}) {

  const [_open, _setOpen] = useState(false);



  return (
    <Popover onOpenChange={(e) => {
      if (!setOpen) {
        _setOpen(e)
        return;
      }
      setOpen(e)
    }} defaultOpen={false} open={setOpen ? open : _open} >
      <PopoverTrigger type="submit" onSubmit={(e) => {
        e.preventDefault()

      }} onClick={() => {
        if (!setOpen) {
          _setOpen(!_open)
          return;
        }
        setOpen(!open)
      }} asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent id="pop-over" className={cn('w-80', className)}>
        {
          content
        }
        {showBtn && <Button onClick={(e) => {
          handleOnClick(e)
        }} variant="ghost" >submit</Button>}
      </PopoverContent>
    </Popover>
  )
}
