import { Wrench } from "lucide-react"
import { Button } from "../ui/button"
import { PopOverComponent } from "../ui/PopOverComponent"
import { cn } from "@/lib/utils"

const ConfigComponent = ({ children, showWhen }: { children: React.ReactNode, showWhen: boolean }) => {
    return (
        <>
            {<div>

                <PopOverComponent  content={
                    <>     {showWhen && <div className='flex flex-col items-center justify-center gap-4 z-[101] cursor-pointer'>


                        {children}
                    </div>}
                    </>
                } trigger={<Button variant={'ghost'} className={cn({
                    'cursor-wait opacity-50': !showWhen,
                })} onClick={() => {

                }}><Wrench /></Button>} />

            </div>}

        </>
    )
}
export default ConfigComponent;
