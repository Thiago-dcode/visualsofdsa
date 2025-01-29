import { Primitive } from "@/types";
import Node from "../../linear/_classes/Node";

export type OnCompare<T extends Primitive,K extends Node<T>> = (nodeA:K,data:T)=>Promise<void>

export type OnTraversal<T extends Primitive,K extends Node<T>> = (node:K)=>Promise<void>