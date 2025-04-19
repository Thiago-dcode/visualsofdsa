import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

export default function Title({ title, xls, h, uppercase = true, bold, className }: {className?:string, uppercase?: boolean, title: string|ReactNode, xls?: 1 | 2 | 3 | 4 | 5, h?: 1 | 2 | 3 | 4 | 5 | 6, bold?: 1 | 2 | 3 | 4 | 5 }) {

  const fontSize = () => {
    switch (xls) {
      case 1:
        return 'text-xl'
      case 2:
        return 'text-2xl'
      case 3:
        return 'text-3xl'
      case 4:
        return 'text-4xl'
      case 5:
        return 'text-5xl'
      default:
        return 'text-2xl';
    }
  }
  const boldLevel = () => {
    switch (bold) {
      case 1:
        return 'font-normal'
      case 2:
        return 'text-medium'
      case 3:
        return 'text-semibold'
      case 4:
        return 'text-bold'
      case 5:
        return 'text-extrabold'
      default:
        return 'font-bold';
    }
  }
  const render = () => {

    const _cn = cn(`font-bold tracking-wide ${uppercase ? 'uppercase' : ''}`, boldLevel(), fontSize(), className);
    switch (h) {
      case 1:
        return <h1 className={_cn}>{title}</h1>
      case 2:
        return <h2 className={_cn}>{title}</h2>
      case 3:
        return <h3 className={_cn}>{title}</h3>
      case 4:
        return <h4 className={_cn}>{title}</h4>
      case 5:
        return <h5 className={_cn}>{title}</h5>
      case 6:
        return <h6 className={_cn}>{title}</h6>
      default:
        return <h1 className={_cn}>{title}</h1>
    }
  }

  return render()


}
