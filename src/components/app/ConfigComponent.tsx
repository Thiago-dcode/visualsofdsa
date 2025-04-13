import { Wrench } from "lucide-react"
import { Button } from "../ui/button"
import { PopOverComponent } from "../ui/PopOverComponent"

const ConfigComponent = ({ children, showWhen }: { children: React.ReactNode, showWhen: boolean }) => {
    return (
        <>
            {showWhen && <div>

                <PopOverComponent content={
                    <div className='flex flex-col items-center justify-center gap-4 z-[101]'>


                        {children}
                    </div>

                } trigger={<Button variant={'ghost'} onClick={() => {

                }}><Wrench /></Button>} />

            </div>}

        </>
    )
}
export default ConfigComponent;
