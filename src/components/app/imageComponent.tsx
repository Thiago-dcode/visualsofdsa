'use client'
import React from 'react'
import Image from 'next/image'
import { useDarkMode } from '@/context/darkModeContext'
export default function ImageComponent({image}:{
    image:{
        light:string,
        dark:string
    }
}) {


    const {isDark} = useDarkMode()
  return (
    <Image alt='data structure image'src={require(`@/assets/images/${isDark?image.dark:image.light}`)} />
  )
}
