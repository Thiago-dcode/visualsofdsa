import { Wrench } from "lucide-react"
import { Button } from "../ui/button"
import { PopOverComponent } from "../ui/PopOverComponent"
import { cn } from "@/lib/utils"

const ConfigComponent = ({ children, available, messageWhenNotAvailable }: { children: React.ReactNode, available: boolean, messageWhenNotAvailable?: string }) => {
    return (
        <>
         

                <PopOverComponent className='z-[101]' available={available} messageWhenNotAvailable={messageWhenNotAvailable} content={
                   <div className='flex flex-col items-center justify-center gap-4 z-[101] cursor-pointer'>
                        {children}
                    </div>
                } trigger={<Button variant={'no-style'} size={'fit'} className={cn(' hover:bg-transparent ',{
                    'cursor-wait opacity-50': !available,
                })} onClick={() => {

                }}><Wrench /></Button>} />


        </>
    )
}
export default ConfigComponent;
