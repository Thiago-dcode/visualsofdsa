import { MemorySize, Primitive } from "@/types";
import Node from "../../_classes/Node";
import Position from "@/lib/classes/position/Position";

export class DynamicArrayNode<T extends Primitive> extends Node<T> {

  static nodeSize:MemorySize;
  private _isLastInserted:boolean;
  constructor(data: T, positon: Position, isLastInserted=false) {
    super(data, positon);
    DynamicArrayNode.nodeSize = MemorySize.M; 
    this._isLastInserted = isLastInserted;
  }
  get isLastInserted(){
    return this._isLastInserted
  }
  set isLastInserted(value:boolean){
     this._isLastInserted = value;
  }


}
