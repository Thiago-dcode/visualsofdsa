import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import React from "react"

export function PopOverComponent({
trigger,
content,
handleOnClick= ()=>{},
showBtn = false,
className= '',
open= false
}:{
    trigger: React.ReactNode;
    content: React.ReactNode;
    handleOnClick?: (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void,
    showBtn?: boolean,
    className?: string,
    open?: boolean
}) {


  const setOpen = (value:boolean):boolean=>{

    
      return value;

  }
  return (
    <Popover defaultOpen ={false}  open={setOpen(open)}>
      <PopoverTrigger  asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent id="pop-over" className={cn('w-80',className)}>
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
