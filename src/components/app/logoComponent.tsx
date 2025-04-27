'use client'
import logodark from '@/assets/images/logodark.png'
import logolight from '@/assets/images/logolight.png'
import Link from 'next/link'
import Image from 'next/image'
import { useDarkMode } from '@/context/darkModeContext'

export default function LogoComponent() {
    const {isDark} = useDarkMode()
  return (
    <Link href={'/'} className=""><Image className='phone:w-[50px] phone:h-[50px] w-[40px] h-[40px] object-contain' priority alt="visuals of dsa logo"height={0} width={0} src={isDark?logodark:logolight} /></Link>
  )
}
