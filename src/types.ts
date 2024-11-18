export type Primitive = number | string |null;
export type speed = 1 | 2 | 3;
export type Ref = HTMLElement | null;
export type Direction= 'reverse' |'forward'
export type listName = 'linkedList'| 'queue' | 'stack'
export type ButtonActionType = 'read'|'write'|'delete'|'search' | 'insert' | 'fill'
export enum MemorySize  {
    S = 40,
    M = 80,
    L = 120,

}
export type Position ={
    x:number,
    y:number
}