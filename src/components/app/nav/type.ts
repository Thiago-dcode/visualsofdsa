export type LinkItem = {
    name: string,
    link: `/${string}`,
    children: LinkItem[] | null,
    enable: boolean
}