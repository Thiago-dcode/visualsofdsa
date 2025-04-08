import NodeShape from "@/lib/classes/NodeShape";
import NotAllowedSizeError from "../../../../lib/errors/MaxSizeExceededError";
import { listName } from "@/types";

export default abstract class List extends NodeShape {
  private _maxSize;
  private _beginner: number = 0;
  private _name: listName;
  constructor(_name: listName) {
    super(100, 50, 5);
    this._name = _name;
    this._maxSize = 10;
    this.setBeginner();
  }
  get name() {
    return this._name;
  }
  get maxSize() {
    return this._maxSize;
  }
  set maxSize(max: number) {
    if (max > 100 || max < 1) {
      throw new NotAllowedSizeError("a size must be between 1 and 100");
    }

    this._maxSize = max;
    this.setBeginner();
  }
  get beginner() {
    return this._beginner;
  }
  private setBeginner() {
    if (this.name === 'stack') {
      this._beginner = this.maxSize * (this.nodeHeightSpacing + this.nodeHeight);
    }else{
      this._beginner = 0;
    }
  }
  abstract get isEmpty(): boolean;
  abstract get isFull(): boolean;
  abstract get size(): number;
}
