import React from 'react'

export default function Title({title}:{title:string}) {
  return (
    <h1 className='font-bold text-2xl uppercase'>{title}</h1>
  )
}
