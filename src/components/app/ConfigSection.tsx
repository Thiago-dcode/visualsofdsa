'use client'
import { Wrench } from 'lucide-react'
import DarkModeTogglerComponent from './DarkModeTogglerComponent'
import MuteComponent from './MuteTogglerComponent'
import { useAnimationRunning } from '@/context/animationRunningContext'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import TogglePauseAnimationComponent from './TogglePauseAnimationComponent'
export default function ConfigSection() {
    const { isAnimationRunning } = useAnimationRunning()
    return (
      <>
        <div className="hidden phone:flex items-center justify-center phone:gap-1 w-f">
            {!isAnimationRunning ?
                <>
                    <DarkModeTogglerComponent />
                    <MuteComponent />
                    <TogglePauseAnimationComponent />
                </> : <div></div>}
        </div>

       <div className='phone:hidden'>
       <DropdownMenu>
            <DropdownMenuTrigger asChild >
               
                    <Wrench className='w-6 h-6' />
              
            </DropdownMenuTrigger>
            <DropdownMenuContent className='dark:bg-app-bg-black bg-app-off-white text-app-text-black dark:text-app-off-white border border-app-bg-black dark:border-app-off-white min-w-fit'>   
                <DropdownMenuItem className='flex flex-col items-center justify-center gap-2'>
                    <DarkModeTogglerComponent />
                    <MuteComponent />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
       </div>
    
      </>
    )
}
