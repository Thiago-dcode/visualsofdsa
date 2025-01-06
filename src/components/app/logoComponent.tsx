'use client'
import logodark from '@/assets/images/logodark.png'
import logolight from '@/assets/images/logolight.png'
import Link from 'next/link'
import Image from 'next/image'
import { useDarkMode } from '@/context/darkModeContext'

export default function LogoComponent() {
    const {isDark} = useDarkMode()
  return (
    <Link href={'/'} className=""><Image priority alt="visuals of dsa logo" height={50} width={50} src={isDark?logodark:logolight} /></Link>
  )
}
