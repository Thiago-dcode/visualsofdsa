import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from "react"

export function PopOverComponent({
trigger,
content,
handleOnClick= ()=>{},
showBtn = false
}:{
    trigger: React.ReactNode;
    content: React.ReactNode;
    handleOnClick?: (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void,
    showBtn?: boolean
}) {
  return (
    <Popover >
      <PopoverTrigger  asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80">
       {
        content
       }
       { showBtn && <Button onClick={(e)=>{
                handleOnClick(e)
        }} variant="ghost" >submit</Button>}
      </PopoverContent>
    </Popover>
  )
}
