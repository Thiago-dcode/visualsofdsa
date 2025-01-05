
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription
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
      <AlertDialogContent style={{
        zIndex:99
      }}  className="dark:text-app-off-white text-app-off-black flex flex-col justify-between">
      <AlertDialogTitle>{title}</AlertDialogTitle>
      
{/* 
        <h1 className="text-2xl font-bold border-b-2 border-b-black pb-2" >{title}</h1> */}
        <AlertDialogDescription className="text-xl">{description}</AlertDialogDescription>
        <AlertDialogFooter>
          <Button variant={'no-style'} className=" border-2 border-white font-bold bg-app-bauhaus-red flex items-center justify-center" onClick={(e) => {
            handleOnPopUpButton(e)
          }}><span className="text-center">{buttonText}</span></Button>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}