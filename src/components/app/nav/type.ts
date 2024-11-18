import { ReactElement } from "react"

export type LinkItem = {
    name: string,
    link: `/${string}` | '#',
    children: LinkItem[] | null,
    image?: {
        dark: string,
        light:string
    },
    description?: string|ReactElement,
    enable: boolean
}