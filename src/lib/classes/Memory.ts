export default abstract class Memory {

  constructor(private _memoryAdress = "",private _isLastAdd = false,private _isFiller = false) {}

  get memoryAddress() {
    return this._memoryAdress;
  }
  set memoryAddress(memoryAddress: string) {
    this._memoryAdress = memoryAddress;
  }
  get isLastAdd() {
    return this._isLastAdd;
  }
  set isLastAdd(isLastAdd: boolean) {
    this._isLastAdd = isLastAdd;
  }
  get isFiller() {
    return this._isFiller;
  }
  set isFiller(isFiller: boolean) {
    this._isFiller = isFiller;
  }
}


