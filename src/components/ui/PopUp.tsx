
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react";

export function PopUp({
  open,
  description,
  title,
  showTrigger = true,
  handleOnPopUpButton = () => { },
  buttonText
}: {
  open: boolean;
  description: ReactNode;
  showTrigger?: boolean;
  handleOnPopUpButton?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  buttonText: string;
  title: string
}) {
  return (
    <AlertDialog  open={open}>
      {showTrigger && <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>}
      <AlertDialogContent className=" text-black flex flex-col justify-between ">
      <AlertDialogTitle>{title}</AlertDialogTitle>
{/* 
        <h1 className="text-2xl font-bold border-b-2 border-b-black pb-2" >{title}</h1> */}
        <p className="text-xl">{description}</p>
        <AlertDialogFooter>
          <Button variant={'destructive'} className="border-2 border-white text-lg" onClick={(e) => {
            handleOnPopUpButton(e)
          }}>{buttonText}</Button>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}