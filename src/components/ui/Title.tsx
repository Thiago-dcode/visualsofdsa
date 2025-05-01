import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

export default function Title({ title, xls, h,uppercase = true, italic = false, bold, className }: {className?:string, uppercase?: boolean,italic?: boolean, title: string|ReactNode, xls?: -1|0 | 1 | 2 | 3 | 4 | 5 | 6 |7, h?: 0 | 1 | 2 | 3 | 4 | 5 | 6, bold?: 0 | 1 | 2 | 3 | 4 | 5 }) {

  const fontSize = () => {
    switch (xls) {
      case -1:
        return 'text-sm phone:text-base'
      case 0:
        return 'text-base phone:text-lg'
      case 1:
        return 'text-lg phone:text-xl'
      case 2:
        return 'text-xl phone:text-2xl'
      case 3:
        return 'text-2xl phone:text-3xl'
      case 4:
        return 'text-3xl phone:text-4xl'
      case 5:
        return 'text-4xl phone:text-5xl'
      case 6:
        return 'text-5xl phone:text-6xl'
      case 7:
        return 'text-6xl phone:text-7xl'
      default:
        return 'text-lg phone:text-2xl';
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

    const _cn = cn(`font-bold tracking-wide`, {
      'italic': italic,
      'uppercase':uppercase
    },boldLevel(), fontSize(), className);
    switch (h) {
      case 0:
        return <p className={_cn}>{title}</p>
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
