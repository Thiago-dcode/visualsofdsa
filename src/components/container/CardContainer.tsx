import { cn } from '@/lib/utils'
import React from 'react'
import { HoverCardContent } from '../ui/hover-card'

type props = {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    color: 'green' | 'yellow' | 'blue'| 'red'
}
const HoverNodeCardContent = ({ children, className = '', style = {}, color }: props) => {
  return (
    <HoverCardContent className={cn(
        'flex flex-col items-start justify-between border-2',className,
        {
          'border-app-bauhaus-green': color === 'green',
          'border-app-bauhaus-yellow': color === 'yellow',
          'border-app-bauhaus-blue': color === 'blue',
          'border-app-bauhaus-red': color === 'red'
        }
      )} style={style}>
        {children}
    </HoverCardContent>
  )
}

export default HoverNodeCardContent