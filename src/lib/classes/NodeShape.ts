export default abstract class NodeShape {
  constructor(
    private _nodeWidth = 100,
    private _nodeHeight = 50,
    private _nodeWidthSpacing = 5,
    private _nodeHeightSpacing = 5,
  ) { }

  get nodeWidth() {
    return this._nodeWidth;
  }
  set nodeWidth(width: number) {
    this._nodeWidth = width;
  }
  get nodeHeight() {
    return this._nodeHeight;
  }
  set nodeHeight(height: number) {
    this._nodeHeight = height;
  }
  get nodeHeightSpacing() {
    return this._nodeHeightSpacing;
  }
  get nodeWidthSpacing() {
    return this._nodeWidthSpacing;
  }
  set nodeHeightSpacing(spacing: number) {
    this._nodeHeightSpacing = spacing;
  }
  set nodeWidthSpacing(spacing: number) {
    this._nodeWidthSpacing = spacing;
  }

}
