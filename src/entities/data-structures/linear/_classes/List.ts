import NotAllowedSizeError from "../../../../lib/errors/MaxSizeExceededError";
import { speed } from "@/types";

export default abstract class List {
  private _width: number;
  private _maxSize;
  private _nodeHeight: number;
  private _nodeSpacing: number;
  private _speed: speed;
  private _beginner: number;
  private _name: string;
  constructor(_name: string) {
    this._name = _name;
    this._width = 350;
    this._maxSize = 10;
    this._nodeHeight = 50;
    this._nodeSpacing = 5;
    this._speed = 2;
    this._beginner = this.maxSize * this.nodeHeight;
  }
  get name() {
    return this._name;
  }

  get nodeHeight() {
    return this._nodeHeight;
  }
  get nodeSpacing() {
    return this._nodeSpacing;
  }
  get width() {
    return this._width;
  }
  set width(width: number) {
    if (width < 100 || width > 600) {
      return;
    }
    this._width = width;
  }
  get maxSize() {
    return this._maxSize;
  }
  set maxSize(max: number) {
    if (max > 100 || max < 1) {
      throw new NotAllowedSizeError("a size must be between 1 and 100");
    }

    this.beginner = max * this.nodeHeight;
    this._maxSize = max;
  }
  get speed() {
    return this._speed;
  }
  set speed(speed: speed) {
    if (speed < 1 || speed > 3) {
      return;
    }
    this._speed = speed;
  }
  get beginner() {
    return this._beginner;
  }
  set beginner(beginner: number) {
    this._beginner = beginner;
  }
  abstract get isEmpty(): boolean;
  abstract get isFull(): boolean;
  abstract get size(): number;

}
