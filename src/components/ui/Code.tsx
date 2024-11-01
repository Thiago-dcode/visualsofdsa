import React, { ReactNode } from 'react'

export default function Code({children}:{
    children:ReactNode,
}) {
  return (
    <span className='bg-black/80 text-white/80 px-[0.2rem] italic text-sm'>{children}</span>
  )
}
